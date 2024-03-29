import React, { Component } from "react";
import { withRouter, Link } from 'react-router-dom';
import { getId, firestore } from "firebase_config";
import { connect } from "react-redux";

import { LoadingComponent } from "components";
import { capitalizeFirstLetter } from "helpers";
import { SetConvos } from "store/actions";
import { truncateText } from "helpers";
import { gtokFavicon } from "images";

class ChatsComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			convoId: props.match.params.id,
			selectedConvo: {},
			currentUser: props.currentUser,
			convos: [],
			loading: true
		}
		this.props = props;
		this.unsubscribe = "";
		this.bindConvos = props.bindConvos;
	}

	componentDidMount() {
		this.getConversations();
	}

	componentWillUnmount() {
		this.unsubscribe && this.unsubscribe();
	}

	getSelectedConversation = async (id) => {
		if (!id) { id = this.state.convoId }
		let result = await getId("conversations", id);
		result = await this.setConvoFields(result);
		result["id"] = id;
		this.setState({
			convoId: id,
			selectedConvo: result
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
						// this.setState({
						// 	convos: convosList.sort((a,b) => a.lastMessageTime - b.lastMessageTime),
						// 	loading: false
						// });
					}
				})
				this.setState({
					convos: convosList.sort((a,b) => b.lastMessageTime - a.lastMessageTime),
					loading: false
				});
				// this.bindConvos(this.convosList.sort((a,b) => a.updatedAt - b.updatedAt));
			});
		return this.unsubscribe;
	}

	selectConvo = (con) => {
		this.props.history.push("/app/chats/"+con.id);
	}

	setDefaultImg = (e) => {
		e.target.src = gtokFavicon;
	}

	renderConvo = (con) => {
		return con.group ?
			<div className="media p-2">
				<img src={con.photoURL || gtokFavicon} alt="user dp" className="chat-window-dp" onError={this.setDefaultImg} />
				<div className="media-body">
					<h6 className="p-0 mb-0 pl-2">{con.groupName}</h6>
					<small className="p-0 pl-2">
					{con.lastMessage ? truncateText(con.lastMessage, 25) : "No messages yet"}
					</small>
				</div>
			</div>
		:
			con.usersRef.map((user, idx) => {
				return user.id !== this.state.currentUser.id && (
					<div className="media p-2" key={idx}>
						<img src={user.photoURL || gtokFavicon} alt="user dp" className="chat-window-dp" onError={this.setDefaultImg} />
						<div className="media-body">
							<h6 className="p-0 mb-0 pl-2">{capitalizeFirstLetter(user.displayName)}</h6>
							<small className="p-0 pl-2">
								{con.lastMessage ? truncateText(con.lastMessage, 25) : "No messages yet"}
								{
									con.usersRef.map(user => {
										if(user.id === this.state.currentUser.id && user.unread) {
											return (
												<span className="badge badge-secondary pull-right" key={user.id}>1</span>
											);
										} else return "";
									})
								}
							</small>
						</div>
					</div>
				)
			})
	}

	render() {
	  return (
	    <div className="container">
				{ this.state.loading ? <LoadingComponent /> : 
						this.state.convos[0] ?
							<ul className="conversation-list p-0">
								{ this.state.convos.map((con, idx) => (
									<li onClick={e => this.selectConvo(con)} key={idx} className={`${con.id === this.state.convoId ? "active" : ""}`}>
										{this.renderConvo(con)}
									</li>
								))}
							</ul> : 
							<div className="card p-2 text-center text-secondary">
								No chats found. <br/>
								<Link to="/app/search">
									<button className="btn btn-sm btn-link">
										Start a chat now
									</button>
								</Link>
							</div>
				}
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
