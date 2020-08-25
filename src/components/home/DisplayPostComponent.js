import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import moment from "moment";

import { 
	add,
	arrayAdd,
	arrayRemove,
	getId,
	update,
	remove,timestamp
} from "firebase_config";
import { gtokFavicon } from "images";
import { capitalizeFirstLetter } from "helpers";
import { SetPosts } from "store/actions";

const DisplayPostComponent = ({
	currentUser, post, setResult, bindPosts, hideSimilarityBtn=false
}) => {
	const [ postedUser, setPostedUser ] = useState("");
	const [ follower, setFollower ] = useState(false);
	const [ followerLoading, setFollowerLoading ] = useState(true);

	useEffect(() => {
	  const isFollower = async () => {
	  	let f = await post.followers.find(f => f === currentUser.id);
	  	if (!!f) setFollower(true);
	  	setFollowerLoading(false);
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
		setFollowerLoading(true);
  	if (!follower) {
	  	await update("posts", post.id, { followers: arrayAdd(currentUser.id), followersCount: post.followers.length+1 });
  		/* Log the activity */
	  	await add("logs", {
	  		text: `${currentUser.displayName} pinches your post`,
	  		photoURL: currentUser.photoURL,
	  		receiverId: postedUser.id,
	  		userId: currentUser.id,
	  		actionType: "update",
	  		collection: "posts",
	  		actionId: post.id,
	  		actionKey: "followers",
	  		timestamp
	  	});
	  	setFollower(true);
  	} else {
	  	await update("posts", post.id, { followers: arrayRemove(currentUser.id), followersCount: post.followers.length-1 });
  		/* Log the activity */
	  	await add("logs", {
	  		text: `${currentUser.displayName} removed pinch for your post`,
	  		photoURL: currentUser.photoURL,
	  		receiverId: "",
	  		userId: currentUser.id,
	  		actionType: "update",
	  		collection: "posts",
	  		actionId: post.id,
	  		actionKey: "followers",
	  		timestamp
	  	});
	  	setFollower(false);
  	}
  	setFollowerLoading(false);
	}

	const deletePost = async (id) => {
		if (window.confirm("Are you sure to delete this post?")) {
			let result = await remove("posts", id);
  		/* Log the activity */
	  	await add("logs", {
	  		text: `${currentUser.displayName} removed the post`,
	  		photoURL: currentUser.photoURL,
	  		receiverId: "",
	  		userId: currentUser.id,
	  		actionType: "delete",
	  		collection: "posts",
	  		actionId: post.id,
	  		actionKey: "id",
	  		timestamp
	  	});
			setResult(result);
			await bindPosts(currentUser);
		}
	}

  return postedUser && (
    <div className="card card-br-0 mt-2">
			<div className="media post-card-image p-2">
		  	<Link to={"/app/profile/"+post.userId}>
			  	<img className="mr-2" src={postedUser.photoURL || gtokFavicon} alt="Card img cap" />
				</Link>
			  <div className="media-body">
			    <h6 className="my-0 text-camelcase font-small">
			    	{capitalizeFirstLetter(postedUser.displayName)}
			    	{
			    		(post.userId === currentUser.id) && 
				    	<button className="btn btn-sm btn-danger pull-right" onClick={e => deletePost(post.id)}>
				    		<i className="fa fa-trash"></i>
				    	</button>
			    	}
			    </h6>
			    <span className="font-small">
			    <i className="fa fa-clock-o"></i>&nbsp;{moment(post.createdAt).fromNow()}
			    </span>
			  </div>
		  </div>
		  <div className="card-body text-center pb-2">
		  	<p className="white-space-preline">{post.text}</p>
	  		<div className="font-small">This post has {post.followersCount} same pinch{post.followersCount !== 1 && "es"}</div>
	  		<div className="mt-2">
		  	{
		  		currentUser.id !== post.userId &&
			  	<button className="btn btn-outline-secondary btn-sm font-xs-small" title="Number of similar people" onClick={e => followPost(e)}>
			  		{followerLoading ? <i className="fa fa-spinner fa-spin"></i> :
			  			<div>
					  		<i className={`fa fa-heart ${follower && "text-danger"}`}></i> &nbsp;
					  		{follower ? "Remove Pinch" : "Same Pinch"}
			  			</div>
			  		}
			  	</button>
			  }
		  	{
		  		currentUser.id !== post.userId && !hideSimilarityBtn &&
			    <Link to={"/app/profile/"+post.userId} className="btn btn-outline-secondary btn-sm ml-2 font-xs-small" title={"Show similarities with "+postedUser.displayName && postedUser.displayName.split(" ")[0]}>
			    	<i className="fa fa-bar-chart"></i> &nbsp;
				    Show similarities
			    </Link>
			  }
			  </div>
		  </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
	return {
		bindPosts: (content) => dispatch(SetPosts(content))
	}
}

export default connect(
	null,
	mapDispatchToProps
)(DisplayPostComponent);