import React, { Component } from "react";
import { add, update, firestore } from "firebase_config";
import { connect } from "react-redux";
import moment from "moment";

import { SetChatMessages } from "store/actions";

class SingleChatComponent extends Component {	
	constructor(props) {
		super(props);
		this.state = {
			message: "",
			messages: props.messages,
			conversation: props.conversation,
			currentUser: props.currentUser
		}
		this.unsubscribe = "";
		this.messagesList = [];
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

	componentWillUnmount() {
		this.unsubscribe();
	}

	scrollToBottom = () => {
		this.el.scrollIntoView();
	}

	getHistory = async () => {
		this.unsubscribe = await firestore.collection("messages")
			.where("conversationId", "==", this.state.conversation.id)
			.onSnapshot(snapshot => {
				snapshot.docChanges().forEach(change => {
					if (change.type === "added") {
						this.messagesList.push(change.doc.data());
						this.setState({
							...this.state,
							messages: this.messagesList.sort((a,b) => a.createdAt - b.createdAt)
						});
						this.bindMessages(this.messagesList.sort((a,b) => a.createdAt - b.createdAt));
					}
				})
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
  		admin: this.state.currentUser.id
  	}
  	await add("messages", data);
  	await update("conversations", this.state.conversation.id, this.state.conversation);
  	this.setState({
  		...this.state,
  		message: "",
  		messages: [...this.state.messages, data]
  	});
  }

  isMsgAdmin = (adminId) => {
  	return adminId !== this.state.currentUser.id;
  }

  render() {
	  return (
	    <div className="container p-2">
    		<div className="chat-window-header media p-2">
    			<img src={this.state.conversation.photoURL} alt="user dp" className="chat-window-dp" />
    			<div className="media-body">
    				<h6 className="p-0 mb-0 pl-2">{this.state.conversation.groupName}</h6>
    				<small className="p-0 pl-2">
    				Last updated {moment(this.state.conversation.updatedAt).format("HH:mm DD/MM/YYYY")}
    				</small>
	    		</div>
    		</div>
	    	<div className="chat-window pt-2 pr-2">
		    	{
		    		this.messagesList && this.messagesList.map((msg, idx) => (
		    			<div key={idx}>
			    			<p className={`${this.isMsgAdmin(msg.admin) ? "sender" : "receiver"} p-2`}>
			    				<small className="pull-right">{moment(msg.createdAt).format("HH:mm DD/MM/YY")}</small> <br/>
			    			{msg.text}
			    			</p>
			    		</div>
						))
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