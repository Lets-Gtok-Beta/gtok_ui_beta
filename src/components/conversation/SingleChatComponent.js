import React, { Component } from "react";
import { add, firestore } from "firebase_config";
import moment from "moment";

class SingleChatComponent extends Component {	
	constructor(props) {
		super(props);
		this.state = {
			message: "",
			messages: [],
			conversation: props.conversation,
			currentUser: props.currentUser
		}
		this.messagesList = [];
	}

	componentDidMount() {
		this.getHistory();
		this.scrollToBottom();
	}

	componentDidUpdate() {
		this.scrollToBottom();
	}

	scrollToBottom = () => {
		this.el.scrollIntoView({ behavior: 'smooth' });
	}

	getHistory = async () => {
  	// async function getMessages() {
			// let messages = await getQuery(
			// 	firestore.collection("messages").where("conversationId", "==", conversation.id).get()
			// );
			// setMessages(messages);
  	// }

  	// async function getNewMessages() {

			await firestore.collection("messages")
				.where("conversationId", "==", this.state.conversation.id)
				.onSnapshot(snapshot => {
					snapshot.docChanges().forEach(change => {
						if (change.type === "added") {
							this.messagesList.push(change.doc.data());
							this.setState({
								...this.state,
								messages: this.messagesList.sort((a,b) => a.createdAt - b.createdAt)
							})
						}
					})
				})
  	// }

  	// getMessages();
  	// getNewMessages();
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
  		from: this.state.currentUser.uid,
  		to: "hemanth.vja@gmail.com"
  	}
  	await add("messages", data);
  	this.setState({
  		...this.state,
  		message: "",
  		messages: [...this.state.messages, data]
  	});
  }

  render() {
	  return (
	    <div className="container p-2">
	    	<div className="chat-window">
		    	{
		    		this.messagesList && this.messagesList.map((msg, idx) => (
		    			<div key={idx}>
			    			<p className={`${msg.from === this.state.currentUser.uid ? "receiver" : "sender"} p-2`}>{msg.text}
			    				<small className="pull-right">{moment(msg.createdAt).format("HH:mm DD/MM/YY")}</small>
			    			</p>
			    		</div>
						))
		    	}
	    		<div ref={el => {this.el = el;}}></div>
	    	</div>
	      <div className="row">
	    		<div className="col-11">
		      	<textarea className="reply-box" rows="1" placeholder="Write message here.." onChange={e => this.setState({message: e.target.value})} onKeyPress={e => this.handleKeyPress(e)}>
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

export default SingleChatComponent;