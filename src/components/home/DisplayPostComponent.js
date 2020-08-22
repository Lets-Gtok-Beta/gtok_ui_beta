import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import { arrayAdd, arrayRemove, getId, update } from "firebase_config";
import { gtokFavicon } from "images";
import { CheckSimilarityComponent } from "components";
import { capitalizeFirstLetter } from "helpers";

const DisplayPostComponent = ({currentUser, post}) => {
	const [ postedUser, setPostedUser ] = useState("");
	const [ follower, setFollower ] = useState(false);
	const [ openSimilarities, setOpenSimilarities ] = useState(false);

	useEffect(() => {
	  const isFollower = async () => {
	  	let f = await post.followers.find(f => f === currentUser.id);
	  	if (!!f) setFollower(true);
	  }
		isFollower();
		async function getPostedUser() {
			let result = await getId("users", post.userId);
			result["id"] = post.userId;
			setPostedUser(result);
		}
		getPostedUser();
	}, [post, currentUser]);

	const followPost = async (e) => {
		if (currentUser.id === postedUser.id) {
			alert("You cannot follow yourself.")
			return null;
		}
  	if (!follower) {
	  	await update("posts", post.id, { followers: arrayAdd(currentUser.id) });
	  	setFollower(true);
  	} else {
	  	await update("posts", post.id, { followers: arrayRemove(currentUser.id) });
	  	setFollower(false);
  	}
	}

  return postedUser && (
    <div className="card mt-2">
			<div className="media post-card-image p-2">
		  	<Link to={"/app/profile/"+post.userId}>
			  	<img className="mr-2" src={postedUser.photoURL || gtokFavicon} alt="Card img cap" />
				</Link>
			  <div className="media-body">
			    <h6 className="mt-0 text-camelcase font-small">
			    	{capitalizeFirstLetter(postedUser.displayName)}
			    </h6>
			  </div>
		  </div>
		  <div className="card-body">
		  	<p dangerouslySetInnerHTML={{__html: post.text}}></p>
		  	<button className="btn btn-sm pl-0" title="Number of similar people" onClick={e => followPost(e)}>
		  		<i className={`fa fa-heart ${follower && "text-danger"}`}></i> &nbsp;
		  		{follower ? "Unfollow" : "Follow"} ({post.followers.length})
		  	</button>
		  	{
		  		currentUser.id !== post.userId &&
			    <button className="btn btn-link btn-sm pl-0 pull-right" onClick={e => setOpenSimilarities(true)}>
				    Compare with {postedUser.displayName && postedUser.displayName.split(" ")[0]}
			    </button>
			  }
		  </div>
			{openSimilarities && <CheckSimilarityComponent setOpenModal={setOpenSimilarities} currentUser={currentUser} selectedUser={postedUser} redirectTo="home" />}
    </div>
  );
};

export default DisplayPostComponent;