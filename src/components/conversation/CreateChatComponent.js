import React, { useEffect } from "react";
import { withRouter } from 'react-router-dom';
import { add, getId, getQuery, firestore } from "firebase_config";

const CreateChatComponent = (props) => {
	const chatUserId = props.match.params.id;
	const { currentUser } = props;

	useEffect(() => {
		let usersInStrFormat = [currentUser.id, chatUserId].sort().toString();
		async function checkForConvo() {
			let convo = await getQuery(
				firestore.collection("conversations").where("usersInStrFormat", "==", usersInStrFormat).get()
			);
			return convo;
		}
		async function getInitialConversation() {
			let convo = await checkForConvo();

			if (!convo[0]) {
				let resultUser = await getUser(chatUserId);
				let data = {
					admin: currentUser.id,
					usersInStrFormat: usersInStrFormat,
					users: [currentUser.id, chatUserId],
					groupName: resultUser["displayName"],
					photoURL: resultUser["photoURL"]
				}

				await add("conversations", data);
				convo = await checkForConvo();
			}
			props.history.push("/app/chats/"+convo[0].id);
		}
		getInitialConversation();
	}, [chatUserId, currentUser.id, props.history]);


  const getUser = async (id) => {
  	let result = await getId("users", id);
  	return result || {};
  }

  return (
    <div className="container-fluid text-center">
    	<i className="fa fa-spinner"></i>
    </div>
  );
};

export default withRouter(CreateChatComponent);