import React, { useState, useEffect } from "react";
import { useHistory, Link } from 'react-router-dom';

import { add, update, arrayAdd, arrayRemove, timestamp } from "firebase_config";
import { 
	NotificationComponent, 
	CheckSimilarityComponent
} from "components";
import { capitalizeFirstLetter } from "helpers";
import { gtokFavicon } from "images";

const SearchUserComponent = ({displayUser, currentUser}) => {
	const history = useHistory();
	const [ follower, setFollower ] = useState(false);
	const [ isFollowerLoading, setIsFollowerLoading ] = useState(true);
	const [ result, setResult ] = useState({});
	const [ openSimilarities, setOpenSimilarities ] = useState(false);
	const [ selectedUser, setSelectedUser ] = useState({});
	const [ bigImg, setBigImg ] = useState('');

	useEffect(() => {
	  const isFollower = async () => {
	  	let f = await displayUser.followers.find(f => f === currentUser.id);
	  	setIsFollowerLoading(false);
	  	if (!!f) {
	  		setFollower(true);
	  	}
	  }
		isFollower();
	}, [currentUser.id, displayUser.followers]);

  const followUser = async () => {
  	setResult({status: 100, message: "Processing..."});
  	setIsFollowerLoading(true);
  	let res = "";
  	if (!follower) {
	  	res = await update("users", displayUser.id, { followers: arrayAdd(currentUser.id) });
	  	/* Alert display user about current user */
	  	await add("logs", {
	  		text: `${currentUser.displayName} followed you`,
	  		photoURL: currentUser.photoURL,
	  		receiverId: displayUser.id,
	  		userId: currentUser.id,
	  		actionType: "follow",
	  		timestamp
	  	});
	  	setFollower(true);
  	} else {
	  	res = await update("users", displayUser.id, { followers: arrayRemove(currentUser.id) });
	  	setFollower(false);
  	}
  	setIsFollowerLoading(false);
  	setResult(res);
  }

  const openModal = (selectedUser) => {
  	setSelectedUser(selectedUser);
  	setOpenSimilarities(true);
  }

  const msgUser = async () => {
  	let premium = currentUser.badges.find(b => b.title === "Premium");
  	if (!premium) {
  		alert("Upgrade to premium to message others");
  		return null;
  	}
  	history.push("/app/chats/new/"+displayUser.id);
  }

  return (
		<div className="container col-xs-12 my-xs-2 my-md-3">
			<div className="card p-2">
				{result.status && <NotificationComponent result={result} setResult={setResult} />}
				{
					bigImg &&
					<div className="profile_card_big_img" onClick={e => setBigImg("")}>
				  	<img className="mr-2" src={bigImg} alt="Card img cap" />
					</div>
				}
				<div className="media profile_card_img">
			  	<img className="mr-2" src={displayUser.photoURL || gtokFavicon} alt="Card img cap" onClick={e => setBigImg(displayUser.photoURL)} />
				  <div className="media-body">
				    <h6 className="mt-0 text-camelcase">
					  	<Link to={"/app/profile/"+displayUser.id}>
					    	{(displayUser.displayName && capitalizeFirstLetter(displayUser.displayName)) || "No name"}
					   	</Link>
				    </h6>
				    <p>
				  		<button className={`btn btn-sm ${follower ? "btn-secondary" : "btn-outline-secondary"} btn_follow`}>
					    {
					    	isFollowerLoading ? <i className="fa fa-spinner fa-spin"></i> : (
						    	<small className="pull-right" onClick={e => followUser()}>{
						    		follower ? "Unfollow"	: "Follow"
						    	}</small>
						    )
					    }
					    </button>
					    <button className="btn btn-sm btn-outline-secondary ml-2 btn_send_text" onClick={e => msgUser()} title="Send text">
					    	<i className="fa fa-comment"></i>
						  </button>
				    </p>
				  </div>
			  </div>
			  <div className="card-body">
			  	<small>
				  	See your similarities with {displayUser.displayName}.
				    <button className="btn btn-link btn-sm pl-0" onClick={e => openModal(displayUser)}>
				    Click here
				    </button>
				  </small>
			  </div>
			</div>
			{openSimilarities && selectedUser && <CheckSimilarityComponent setOpenModal={setOpenSimilarities} currentUser={currentUser} selectedUser={selectedUser} />}
		</div>
  );
};

export default SearchUserComponent;