import React, { useState, useEffect } from "react";
import { add, getQuery, firestore } from "firebase_config";
import { SingleChatComponent } from "components";

const ChatsComponent = (props) => {
	const { currentUser } = props;
	const [ conversation, setConversation ] = useState({});

  useEffect(() => {
  	async function getConversation() {
			let convo = await getQuery(
				firestore.collection("conversations").where("users", "array-contains-any", ["hemanth.vja@gmail.com", currentUser.uid]).get()
			);
			if (!convo[0]) {
				let data = {
					users: [currentUser.uid, "hemanth.vja@gmail.com"]
				}
				await add("conversations", data);
				setConversation(data);
			} else {
				setConversation(convo[0]);
			}
  	}

  	getConversation();
  }, [currentUser.uid]);

  return (
    <div className="container-fluid">
      <h5 className="text-center">
      	This is our personal bot system.
      	If you're not a premium user, your chat will be erased completely after 6 hours.
      </h5>
      {
      	conversation.id && <SingleChatComponent conversation={conversation} currentUser={currentUser} />
      }

			{/*		<iframe height="430" width="350" src="https://bot.dialogflow.com/3b271305-b775-411d-a423-adbd77bfca40"></iframe>
			<div className="row">
				<div className="col-2">
					<ul className="conversation-list">
						<li>First convo</li>
						<li>2nd convo</li>
					</ul>
				</div>
				<div className="col-10">
		      <h5 className="text-center">
		      	If you're not a premium user, your chat will be erased completely after 6 hours.
		      </h5>
		      {
		      	conversation.id && <SingleChatComponent conversation={conversation} currentUser={currentUser} />
		      }
				</div>
			</div>*/}
    </div>
  );
};

export default ChatsComponent;