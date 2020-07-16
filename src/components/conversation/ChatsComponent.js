import React, { Component } from "react";
import { add, getId, getQuery, update, firestore } from "firebase_config";
import { connect } from "react-redux";
import moment from "moment";

import { SingleChatComponent } from "components";
import { SetConvos } from "store/actions";

class ChatsComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			conversation: {},
			convos: props.conversations,
			currentUser: props.currentUser
		}
		this.defaultImage = "../logo192.png"; 
		this.unsubscribe = "";
		this.convosList = [];
		this.bindConvos = props.bindConvos;
		this.constUserId = "sL8tqx4Gt9yWBEH6cn7G";
	}

	componentDidMount() {
		this.getInitialConversation();
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	getInitialConversation = async () => {
		let convo = await getQuery(
			firestore.collection("conversations").where("users", "array-contains-any", [this.state.currentUser.id]).get()
		);
		if (!convo[0]) {
			let resultUser = await this.getUser(this.constUserId);
			let data = {
				admin: this.state.currentUser.id,
				users: [this.state.currentUser.id, this.constUserId],
				groupName: "Personal bot",
				photoURL: resultUser["photoURL"] || this.defaultImage
			}

			await add("conversations", data);
			this.setState({
				...this.state,
				convos: [data]
			});
		} else {
			this.getConversations();
		}		
	}

  getUser = async (id) => {
  	let result = await getId("users", id);
  	return result || {};
  }

	getConversations = async () => {
		this.unsubscribe = await firestore.collection("conversations")
			.where("users", "array-contains-any", [this.state.currentUser.id])
			.onSnapshot(snapshot => {
				snapshot.docChanges().forEach(change => {
					if (change.type === "added") {
						let convo = change.doc.data();
						convo.users.map(async (uId) => {
							if (uId !== this.state.currentUser.id) {
								let resultUser = await this.getUser(uId);
								convo["groupName"] = resultUser["displayName"] || "No name";
								convo["photoURL"] = resultUser["photoURL"];
								await update("conversations", convo.id, convo);
							}
						});
						this.convosList.push(convo);
						this.convosList = this.convosList.sort((a,b) => a.updatedAt - b.updatedAt);
						this.setState({
							...this.state,
							convos: this.convosList
						});
						this.bindConvos(this.convosList);
					}
				})
			})
		return this.unsubscribe;
	}

	render() {
	  return (
	    <div className="container-fluid">
	      {/*<h5 className="text-center">
	      	This is our personal bot system.
	      	If you're not a premium user, your chat will be erased completely after 6 hours.
	      </h5>
	      {
	      	conversation.id && <SingleChatComponent conversation={conversation} currentUser={currentUser} />
	      }

						<iframe height="430" width="350" src="https://bot.dialogflow.com/3b271305-b775-411d-a423-adbd77bfca40"></iframe>*/}
				<div className="row">
					<div className="col-3 sidebar p-0">
						<ul className="conversation-list p-0">
							{ this.state.convos.map((con, idx) => (
								<li key={idx} onClick={e => this.setState({...this.state, conversation: con})}>
					    		<div className="media p-2">
					    			<img src={con.photoURL} alt="user dp" className="chat-window-dp" />
					    			<div className="media-body">
					    				<h6 className="p-0 mb-0 pl-2">{con.groupName}</h6>
					    				<small className="p-0 pl-2">
					    				Last updated {con.updatedAt ? moment(con.updatedAt).format("HH:mm DD/MM/YY") : moment(con.createdAt).format("HH:mm DD/MM/YY")}
					    				</small>
						    		</div>
					    		</div>
								</li>
							))}
						</ul>
					</div>
					<div className="col-9">
			      <h5 className="text-center">
			      	If you're not a premium user, your chat will be erased completely after 6 hours.
			      </h5>
			      {
			      	this.state.conversation.id && <SingleChatComponent conversation={this.state.conversation} currentUser={this.state.currentUser} />
			      }
					</div>
				</div>
	    </div>
	  );
	}
};

const mapStateToProps = (state) => {
	const { conversations } = state.conversations;
	return { conversations }
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindConvos: (content) => dispatch(SetConvos(content))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChatsComponent);