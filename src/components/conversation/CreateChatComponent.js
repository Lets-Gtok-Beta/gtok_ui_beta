import React, { useEffect } from "react";
import { withRouter, useHistory } from 'react-router-dom';
import { add, getId, getQuery, update, firestore } from "firebase_config";

const CreateChatComponent = (props) => {
	const chatUserId = props.match.params.id;
	const { currentUser } = props;
	const history = useHistory();
	const usersInStrFormat = [currentUser.id, chatUserId].sort().toString();

	useEffect(() => {
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
			history.push("/app/chats/"+convo[0].id);
		}
		getInitialConversation();
	}, [chatUserId]);

	const checkForConvo = async () => {
		let convo = await getQuery(
			firestore.collection("conversations").where("usersInStrFormat", "==", usersInStrFormat).get()
		);
		return convo;
	}

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