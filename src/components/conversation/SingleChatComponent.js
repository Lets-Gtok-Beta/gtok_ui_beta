import React, { Component } from "react";
import { add, getQuery, update, arrayRemove, firestore } from "firebase_config";
import { connect } from "react-redux";
import moment from "moment";

import { SetChatMessages } from "store/actions";

class SingleChatComponent extends Component {	
	constructor(props) {
		super(props);
		this.state = {
			message: "",
			messagesList: [],
			conversation: props.conversation,
			currentUser: props.currentUser
		}
		this.defaultImage = "../../logo192.png"; 
		this.unsubscribe = "";
		// this.messagesList = [];
		this.bindMessages = props.bindMessages;
	}

	componentDidMount() {
		this.getHistory();
		this.scrollToBottom();
		// this.scrollToBottom({behavior: "smooth"});
	}

	componentDidUpdate() {
		this.scrollToBottom();
	}

	componentWillReceiveProps(newProps) {
		if (newProps.conversation.id !== this.props.conversation.id) {
			this.getInitialMessages(newProps.conversation);
			this.scrollToBottom();
		}
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	getInitialMessages = async (conversation) => {
		let result = await getQuery(
			firestore.collection("messages").where("conversationId", "==", conversation.id).get()
		);
		this.setState({
			...this.state,
			conversation,
			messagesList: result.sort((a,b) => a.createdAt - b.createdAt)
		});
	}

	scrollToBottom = () => {
		this.el.scrollIntoView();
	}

	getHistory = async () => {
		let messagesList = []
		this.setState({loading: true, messagesList: []});
		this.unsubscribe = await firestore.collection("messages")
			.where("conversationId", "==", this.state.conversation.id)
			.onSnapshot(async (snapshot) => {
				snapshot.docChanges().forEach(async (change) => {
					if (change.type === "added") {
						let msg = change.doc.data();
						messagesList.push(msg);
					}
				})
				await new Promise(resolve => 
					this.setState({
						loading: false,
						messagesList: messagesList.sort((a,b) => a.createdAt - b.createdAt)
					}, () => resolve())
				)
				// this.bindMessages(this.messagesList.sort((a,b) => a.createdAt - b.createdAt));
			})
		return this.unsubscribe;
	}

  handleKeyPress = (e) => {
  	if (e.key === "Enter" && e.key === "Shift") {
  		e.default();
  	} else if (e.key === "Enter") {
  		this.sendMessage();
  	}
  }

  sendMessage = async () => {
  	if (!this.state.message.trim()) { return; }
  	let data = {
  		conversationId: this.state.conversation.id,
  		text: this.state.message,
  		users: this.state.conversation.users,
  		admin: this.state.currentUser.id,
  		unread: this.state.conversation.users.filter(u => (u !== this.state.currentUser.id))
  	}
  	await add("messages", data);
  	this.setState({
  		...this.state,
  		message: "",
  		messagesList: [...this.state.messagesList, data]
  	});
  }

  isMsgAdmin = (adminId) => {
  	return adminId !== this.state.currentUser.id;
  }

  render() {
	  return (
	    <div className="container p-2">
    		<div className="chat-window-header media p-2">
    			<img src={this.state.conversation.photoURL || this.defaultImage} alt="user dp" className="chat-window-dp" />
    			<div className="media-body">
    				<h6 className="p-0 mb-0 pl-2">{this.state.conversation.groupName}</h6>
    				<small className="p-0 pl-2">
    				Last updated {moment(this.state.conversation.updatedAt).format("HH:mm DD/MM/YY")}
    				</small>
	    		</div>
    		</div>
	    	<div className="chat-window pt-2 pr-2">
		    	{
		    		this.state.loading ? <i className="fa fa-spinner"></i> : 
		    		this.state.messagesList[0] ? 
		    			this.state.messagesList.map((msg, idx) => (
			    			<div key={idx}>
				    			<p className={`${this.isMsgAdmin(msg.admin) ? "sender" : "receiver"} p-2`}>
				    				<small className="pull-right">{moment(msg.createdAt).format("HH:mm DD/MM/YY")}</small> <br/>
				    			{msg.text}
				    			</p>
				    		</div>
							))
						: <div className="text-center text-secondary"> No messages yet </div>
		    	}
	    		<div ref={el => {this.el = el;}}></div>
	    	</div>
	      <div className="row">
	    		<div className="col-11">
		      	<textarea className="reply-box" rows="1" placeholder="Write message here.." value={this.state.message} onChange={e => this.setState({message: e.target.value})} onKeyPress={e => this.handleKeyPress(e)}>
		      	</textarea>
		      </div>
	      	<div className="col-1">
		      	<i className="fa fa-paper-plane reply-box-icon" onClick={e => this.sendMessage()}></i>
		      </div>
	      </div>
	    </div>
	  );
  }

};

const mapStateToProps = (state) => {
	const { messages } = state.chatMessages;
	return { messages }
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindMessages: (content) => dispatch(SetChatMessages(content))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SingleChatComponent);