import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { getId, firestore } from "firebase_config";
import { connect } from "react-redux";

import { SingleChatComponent } from "components";
import { SetConvos } from "store/actions";
import { truncateText } from "helpers";

class ChatsComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			convoId: props.match.params.id,
			selectedConvo: {},
			currentUser: props.currentUser,
			convos: [],
			loading: true,
			currentChatUser: {},
		}
		this.props = props;
		this.defaultImage = "../../logo192.png"; 
		this.unsubscribe = "";
		this.currentChatUser = {};
		this.bindConvos = props.bindConvos;
	}

	componentDidMount() {
		this.getConversations();
		this.getSelectedConversation();
	}

	componentWillReceiveProps(newProps) {
		if (newProps.match.params.id !== this.props.match.params.id) {
			this.props = newProps;
			this.getSelectedConversation(newProps.match.params.id);
		}
	}

	componentWillUnmount() {
		this.unsubscribe && this.unsubscribe();
	}

	getSelectedConversation = async (id) => {
		if (!id) { id = this.state.convoId }
		let result = await getId("conversations", id);
		result = await this.setConvoFields(result);
		result["id"] = id;
		this.currentChatUser = result.usersRef.find(u => u.id === this.state.currentUser.id);
		this.setState({
			convoId: id,
			selectedConvo: result,
			currentChatUser: result.usersRef.find(u => u.id === this.state.currentUser.id)
		});
	}

	setConvoFields = async (con) => {
		let isChange = false;
		con.usersRef && con.usersRef.forEach(async (user, idx) => {
			if (user.id !== this.state.currentUser.id) {
				let resultUser = await this.getUser(user.id);
				if (
					user["displayName"] !== resultUser["displayName"] || 
					user["photoURL"] !== resultUser["photoURL"]
				) {
					user["displayName"] = resultUser["displayName"];
					user["photoURL"] = resultUser["photoURL"];
					isChange = true;
				}
			}
		});
		if (isChange) {
			// await update("conversations", this.state.convoId, con);
		}
		return con;
	}

  getUser = async (id) => {
  	let result = await getId("users", id);
  	return result || {};
  }

	getConversations = async () => {
		let convosList = [];
		this.setState({loading: true});
		this.unsubscribe = await firestore.collection("conversations")
			.where("users", "array-contains-any", [this.state.currentUser.id])
			.onSnapshot(snapshot => {
				snapshot.docChanges().forEach(change => {
					let convo = change.doc.data();
					convo["id"] = change.doc.id;
					if (change.type === "added") {
						convosList.push(convo);
					}
					if (change.type === "modified") {
						let convosList = this.state.convos;
						let idx = convosList.findIndex(con => con.id === convo.id);
						convosList[idx] = convo;
						this.setState({
							convos: convosList.sort((a,b) => b.updatedAt - a.updatedAt),
							loading: false
						});
					}
				})
				this.setState({
					convos: convosList.sort((a,b) => b.updatedAt - a.updatedAt),
					loading: false
				});
				// this.bindConvos(this.convosList.sort((a,b) => a.updatedAt - b.updatedAt));
			});
		return this.unsubscribe;
	}

	selectConvo = (con) => {
		this.props.history.push("/app/chats/"+con.id);
	}

	renderConvo = (con) => {
		return con.group ?
			<div className="media p-2">
				<img src={con.photoURL || this.defaultImage} alt="user dp" className="chat-window-dp" />
				<div className="media-body">
					<h6 className="p-0 mb-0 pl-2">{con.groupName}</h6>
					<small className="p-0 pl-2">
					{con.lastMessage ? con.lastMessage : "No messages yet"}
					</small>
				</div>
			</div>
		:
			con.usersRef.map((user, idx) => {
				return user.id !== this.state.currentUser.id && (
					<div className="media p-2" key={idx}>
						<img src={user.photoURL || this.defaultImage} alt="user dp" className="chat-window-dp" />
						<div className="media-body">
							<h6 className="p-0 mb-0 pl-2">{user.displayName}</h6>
							<small className="p-0 pl-2">
								{con.lastMessage ? truncateText(con.lastMessage, 25) : "No messages yet"}
								{(con.lastMessageTime > this.currentChatUser.lastSeen) ? <i className="fa fa-dot-circle-o pull-right text-success"></i> : ""}
							</small>
						</div>
					</div>
				)
			})
	}

	render() {
	  return (
	    <div className="container-fluid">
	      {/*<h5 className="text-center">
	      	This is our personal bot system.
	      	If you're not a premium user, your chat will be erased completely after 2 hours.
	      </h5>
	      {
	      	conversation.id && <SingleChatComponent conversation={conversation} currentUser={currentUser} />
	      }

						<iframe height="430" width="350" src="https://bot.dialogflow.com/3b271305-b775-411d-a423-adbd77bfca40"></iframe>*/}
				<div className="row">
					<div className="col-3 sidebar p-0">
						{ this.state.loading ? <i className="fa fa-spinner"></i> : 
							<ul className="conversation-list p-0">
								{ this.state.convos && this.state.convos.map((con, idx) => (
									<li onClick={e => this.selectConvo(con)} key={idx} className={`${con.id === this.state.convoId ? "active" : ""}`}>
										{this.renderConvo(con)}
									</li>
								))}
							</ul>
						}
					</div>
					<div className="col-9">
			      <h5 className="text-center">
			      	If you're not a premium user, your chat will be erased completely after 6 hours.
			      </h5>
			      {
			      	this.state.selectedConvo.id && <SingleChatComponent conversation={this.state.selectedConvo} currentUser={this.state.currentUser} />
			      }
					</div>
				</div>
	    </div>
	  );
	}
};

const mapStateToProps = (state) => {
	// const { conversations } = state.conversations;
	// return { conversations }
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindConvos: (content) => dispatch(SetConvos(content))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(ChatsComponent));