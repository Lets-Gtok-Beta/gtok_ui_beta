// import React, { useEffect, useState } from "react";
// import { withRouter, useHistory } from 'react-router-dom';
// import { add, getId, getQuery, update, firestore } from "firebase_config";
// import { connect } from "react-redux";
// import moment from "moment";

// import { SingleChatComponent } from "components";
// import { SetConvos } from "store/actions";

// const ChatsComponent = (props) => {
// 	const history = useHistory();
// 	const { currentUser } = props;
// 	const defaultImage = "../../logo192.png";
// 	const [ convos, setConvos ] = useState([]);
// 	const [ convoId, setConvoId ] = useState(props.match.params.id);
// 	const [ conversation, setConversation ] = useState({});
// 	var convosList = [], unsubscribe = "";

// 	useEffect(() => {
// 		// getConversations();
// 		getConversationsSnapshot();
// 		unsubscribe && unsubscribe();
// 	}, [convoId]);

//   const getUser = async (id) => {
//   	let result = await getId("users", id);
//   	return result || {};
//   }

// 	const getConversations = async () => {
// 		let convos = await getQuery(
// 			firestore.collection("conversations").where("users", "array-contains-any", [currentUser.id]).get()
// 		);
// 		let selectedCon = convos.find(con => con.id === convoId);
// 		console.log("CONN", convos)

// 		convos = convos.map(con => {
// 			con.users.map(async (uId) => {
// 				if (uId !== currentUser.id) {
// 					let resultUser = await getUser(uId);
// 					if (!con["groupName"] || !con["photoURL"]) {
// 						con["groupName"] = resultUser["displayName"] || "No name";
// 						con["photoURL"] = resultUser["photoURL"];
// 					}
// 				}
// 			})
// 			return con;
// 		});
// 		setConvos(convos);
// 		setConversation(selectedCon);
// 	}

// 	const getConversationsSnapshot = async () => {
// 		unsubscribe = await firestore.collection("conversations")
// 			.where("users", "array-contains-any", [currentUser.id])
// 			.onSnapshot(async (snapshot) => {
// 				await snapshot.docChanges().forEach(change => {
// 					let convosList = [];
// 					if (change.type === "added") {
// 						let convo = change.doc.data();
// 						convo["id"] = change.doc.id;
// 						convo.users.forEach(async (uId) => {
// 							if (uId !== currentUser.id) {
// 								let resultUser = await getUser(uId);
// 								if (!convo["groupName"] || !convo["photoURL"]) {
// 									convo["groupName"] = resultUser["displayName"] || "No name";
// 									convo["photoURL"] = resultUser["photoURL"];
// 								}
// 							} else {
// 								setConversation(convo);
// 							}
// 						});
// 						convosList.push(convo);
// 					}
// 				});
// 				// await setConvos(convosList);
// 			});
// 		return unsubscribe;
// 	}

// 	const selectedConvo = async (con) => {
// 		// let convo = await getQuery(
// 		// 	firestore.collection("conversations").where("usersInStrFormat", "==", con.usersInStrFormat).get()
// 		// );
// 		setConversation(con);
// 		setConvoId(con.id);
// 		let chatUserId = con.users.find(uId => uId !== currentUser.id);
// 		// history.push("/app/chats/new/"+chatUserId);
// 		history.push("/app/chats/"+con.id);
// 	}

//   return (
//     <div className="container-fluid">
//       {/*<h5 className="text-center">
//       	This is our personal bot system.
//       	If you're not a premium user, your chat will be erased completely after 6 hours.
//       </h5>
//       {
//       	conversation.id && <SingleChatComponent conversation={conversation} currentUser={currentUser} />
//       }

// 					<iframe height="430" width="350" src="https://bot.dialogflow.com/3b271305-b775-411d-a423-adbd77bfca40"></iframe>*/}
// 			<div className="row">
// 				<div className="col-3 sidebar p-0">
// 					<ul className="conversation-list p-0">
// 						{ convos.length > 0 && convos.map((con, idx) => (
// 							<li onClick={e => selectedConvo(con)} key={idx} className={`${con.id === convoId ? "active" : ""}`}>
// 				    		<div className="media p-2">
// 				    			<img src={con.photoURL || defaultImage} alt="user dp" className="chat-window-dp" />
// 				    			<div className="media-body">
// 				    				<h6 className="p-0 mb-0 pl-2">{con && con.groupName}</h6>
// 				    				<small className="p-0 pl-2">
// 				    				Last updated {con.updatedAt ? moment(con.updatedAt).format("HH:mm DD/MM/YY") : moment(con.createdAt).format("HH:mm DD/MM/YY")}
// 				    				</small>
// 					    		</div>
// 				    		</div>
// 							</li>
// 						))}
// 					</ul>
// 				</div>
// 				<div className="col-9">
// 		      <h5 className="text-center">
// 		      	If you're not a premium user, your chat will be erased completely after 6 hours.
// 		      </h5>
// 		      {
// 		      	conversation.id && <SingleChatComponent conversation={conversation} currentUser={currentUser} />
// 		      }
// 				</div>
// 			</div>
//     </div>
//   );
// };

// export default withRouter(ChatsComponent);


import React, { Component } from "react";
import { withRouter, Link } from 'react-router-dom';
import { add, getId, getQuery, update, firestore } from "firebase_config";
import { connect } from "react-redux";
import moment from "moment";

import { SingleChatComponent } from "components";
import { SetConvos } from "store/actions";

class ChatsComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			convoId: props.match.params.id,
			selectedConvo: {},
			convos: [],
			currentUser: props.currentUser,
		}
		this.props = props;
		this.defaultImage = "../../logo192.png"; 
		this.unsubscribe = "";
		this.convosList = [];
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
		this.setState({
			...this.state,
			convoId: id,
			selectedConvo: result
		});
	}

	setConvoFields = async (con) => {
		con.users.map(async (uId) => {
			if (uId !== this.state.currentUser.id) {
				let resultUser = await this.getUser(uId);
				if (
					con["groupName"] !== resultUser["displayName"] || 
					con["photoURL"] !== resultUser["photoURL"]
				) {
					con["groupName"] = resultUser["displayName"] || "No name";
					con["photoURL"] = resultUser["photoURL"];
				}
			}
		});		
		return con;
	}

  getUser = async (id) => {
  	let result = await getId("users", id);
  	return result || {};
  }

	getConversations = async () => {
		this.unsubscribe = await firestore.collection("conversations")
			.where("users", "array-contains-any", [this.state.currentUser.id])
			.onSnapshot(snapshot => {
				snapshot.docChanges().forEach(async(change) => {
					if (change.type === "added") {
						let convo = change.doc.data();
						convo["id"] = change.doc.id;
						convo = await this.setConvoFields(convo);
						this.convosList.push(convo);
					}
				})
				this.setState({
					...this.state,
					convos: this.convosList.sort((a,b) => a.updatedAt - b.updatedAt)
				});
				// this.bindConvos(this.convosList.sort((a,b) => a.updatedAt - b.updatedAt));
			});
		return this.unsubscribe;
	}

	selectConvo = (con) => {
		this.props.history.push("/app/chats/"+con.id);
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
								<li onClick={e => this.selectConvo(con)} key={idx} className={`${con.id === this.state.convoId ? "active" : ""}`}>
					    		<div className="media p-2">
					    			<img src={con.photoURL || this.defaultImage} alt="user dp" className="chat-window-dp" />
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
			      	this.state.selectedConvo.id && <SingleChatComponent conversation={this.state.selectedConvo} currentUser={this.state.currentUser} />
			      }
					</div>
				</div>
	    </div>
	  );
	}
};

const mapStateToProps = (state) => {
	const { conversations } = state.conversations;
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