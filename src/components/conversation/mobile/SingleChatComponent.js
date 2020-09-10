import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";
import $ from "jquery";

import { capitalizeFirstLetter } from "helpers";
import { LoadingComponent } from "components";
import { SetChatMessages, SetNewMessagesCount } from "store/actions";
import { gtokFavicon } from "images";
import { add, getId, update, firestore, timestamp } from "firebase_config";

class SingleChatComponent extends Component {	
	constructor(props) {
		super(props);
		this.state = {
			message: "",
			messagesList: [],
			convoId: props.match.params.id,
			currentUser: props.currentUser
		}
		this.unsubscribe = "";
		// this.messagesList = [];
		this.bindMessages = props.bindMessages;
		this.bindNewMessagesCount = props.bindNewMessagesCount;
	}

	componentDidMount() {
		this.getSelectedConversation();
		this.scrollToBottom();
	}

	componentDidUpdate() {
		this.scrollToBottom();
	}

	componentWillUnmount() {
		this.unsubscribe && this.unsubscribe();
	}

	getSelectedConversation = async (id) => {
		if (!id) { id = this.state.convoId }
		let result = await getId("conversations", id);
		result["id"] = id;
		let chatUser = result.usersRef.find(u => u.id !== this.state.currentUser.id);
		let status = null;
		if (this.props.relations[0]) {
			let rln = this.props.relations.find(rln => rln["userIdOne"] === this.state.currentUser.id && rln["userIdTwo"] === chatUser.id);
			if (rln && rln["status"]) { status = rln["status"]; }
		}
		this.setState({
			convoId: id,
			conversation: result,
			chatUser,
			status
		});
		this.getMessagesSnapshot();
	}

	scrollToBottom = (e) => {
		var div = $(".chat-window");
		div.scrollTop(div.prop("scrollHeight"));
	}

	updateConvo = async (data = {}) => {
		// Simplify these lines of code in future
		let chatUserRefs = this.state.conversation.usersRef;
		chatUserRefs = chatUserRefs.map((user) => {
			if (user.id === this.state.currentUser.id) {
				user["lastSeen"] = new Date();
				user["displayName"] = this.state.currentUser.displayName;
				user["photoURL"] = this.state.currentUser.photoURL;
				user["unread"] = false;
			} else {
				if (data["newMessage"]) {
					user["unread"] = true;
					delete data["newMessage"];
				}
			}
			return user;
		});
		await update("conversations", this.state.conversation.id, Object.assign(
			this.state.conversation,
			data,
			{
				usersRef: chatUserRefs
			}
		));
		this.bindNewMessagesCount(this.state.currentUser);
	}

	getMessagesSnapshot = async () => {
		let messagesList = []
		this.setState({loading: true, messagesList: []});
		this.unsubscribe = await firestore.collection("messages")
			.where("conversationId", "==", this.state.convoId)
			.orderBy("timestamp")
			.onSnapshot(async (snapshot) => {
				snapshot.docChanges().forEach(async (change) => {
					if (change.type === "added") {
						let msg = change.doc.data();
						msg["id"] = change.doc.id;
						messagesList.push(msg);
					}
				})
				messagesList = _.uniqBy(messagesList, "id");
				this.setState({
					loading: false,
					messagesList
				});
				await this.updateConvo();
				// this.bindMessages(this.messagesList.sort((a,b) => a.createdAt - b.createdAt));
			})
		return this.unsubscribe;
	}

  handleKeyPress = (e) => {
  	// if (e.key === "Enter" && e.key === "Shift") {
  	// 	e.default();
  	// } else if (e.key === "Enter") {
  	// 	this.sendMessage();
  	// }
  }

  sendMessage = async () => {
  	if (!this.state.message.trim()) { return; }
  	let data = {
  		conversationId: this.state.conversation.id,
  		text: this.state.message.trim(),
  		users: this.state.conversation.users,
  		admin: this.state.currentUser.id,
  		timestamp
  	}
  	await add("messages", data);
  	await this.updateConvo({
  		lastMessage: this.state.message,
  		lastMessageTime: timestamp,
  		newMessage: true
  	});
  	this.setState({
  		message: ""
  	});
  }

  isMsgAdmin = (adminId) => {
  	return adminId !== this.state.currentUser.id;
  }

  renderMessageWindow = () => (
  	<div className="chat-window pt-2 pr-2">
    	{
    		this.state.loading ? <LoadingComponent /> : 
    		this.state.messagesList[0] ? 
    			this.state.messagesList.map((msg, idx) => (
	    			<div key={idx}>
		    			<p className={`${this.isMsgAdmin(msg.admin) ? "sender ml-2" : "receiver"} p-2 white-space-preline`}>
		    				<small className="pull-right">{moment(msg.createdAt).format("HH:mm DD/MM/YY")}</small> <br/>
		    			{msg.text}
		    			</p>
		    		</div>
					))
				: <div className="text-center text-secondary"> No messages yet </div>
    	}
  	</div>
  )

	setDefaultImg = (e) => {
		e.target.src = gtokFavicon;
	}

  render() {
	  return (
	    <div className="container mob-single-chat-window">
	    	{
	    		this.state.conversation && this.state.chatUser ? (
	    			<div>
			    		<div className="chat-window-header media p-2">
			    			<Link to={"/app/profile/"+this.state.chatUser.id}>
				    			<img src={this.state.conversation.photoURL || this.state.chatUser.photoURL || gtokFavicon} alt="user dp" className="chat-window-dp" onError={this.setDefaultImg} />
				    		</Link>
			    			<div className="media-body">
			    				<div className="d-flex">
			    					<div className="flex-grow-1">
					    				<h6 className="pl-2 mb-0">
					    				{this.state.conversation.groupName || capitalizeFirstLetter(this.state.chatUser.displayName)}
					    				</h6>
					    				<small className="pl-2 font-13">
					    				Last updated {moment(this.state.conversation.updatedAt).format("HH:mm DD/MM/YY")}
					    				</small>
			    					</div>
			    					<div className="flex-shrink-1 go-back-btn" title="Go back">
			    						<Link to="/app/chats">
			    							<i className="fa fa-arrow-left"></i>
			    						</Link>
			    					</div>
			    				</div>
				    		</div>
			    		</div>
			    		{this.renderMessageWindow()}
			    		{
						  	(this.state.status !== 1) ? <div className="card text-center mt-2 p-2 text-secondary">You must follow this user to chat.</div> :
					      <div className="d-flex px-3 align-self-center align-items-center chat-window-footer">
					    		<div className="flex-grow-1">
						      	<textarea className="reply-box" rows="2" placeholder="Write message here.." value={this.state.message} onChange={e => this.setState({message: e.target.value})} onKeyPress={e => this.handleKeyPress(e)}>
						      	</textarea>
						      </div>
					      	<div className="flex-shrink-1 pl-2">
						      	<i className="fa fa-paper-plane reply-box-icon" onClick={e => this.sendMessage()}></i>
						      </div>
					      </div>
			    		}
	    			</div>
	    		) : <LoadingComponent />
	    	}
	    </div>
	  );
  }
};

const mapStateToProps = (state) => {
	const { messages } = state.chatMessages;
	const { relations } = state.relationships;
	return { messages, relations }
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindMessages: (content) => dispatch(SetChatMessages(content)),
		bindNewMessagesCount: (content) => dispatch(SetNewMessagesCount(content)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(SingleChatComponent));