import React, { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import moment from "moment";

import { 
	add,
	arrayAdd,
	arrayRemove,
	getId,
	update,
	remove,
	timestamp
} from "firebase_config";
import { gtokFavicon } from "images";
import { capitalizeFirstLetter } from "helpers";
import { SetPosts, SetSharePost } from "store/actions";
import { NotificationComponent } from "components";

const DisplayPostComponent = ({
	currentUser, post, bindPosts, hideSimilarityBtn=false, bindSharePost, hideShareBtn=false, hideRedirects=false
}) => {
	const [ postedUser, setPostedUser ] = useState("");
	const [ follower, setFollower ] = useState(false);
	const [ followerLoading, setFollowerLoading ] = useState(true);
	const [ result, setResult ] = useState({});
	const [ isTalking, setIsTalking ] = useState(false);
	const history = useHistory();

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
		// if (currentUser.id === postedUser.id) {
		// 	alert("You cannot follow yourself.")
		// 	return null;
		// }
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
	  		actionLink: "/app/posts/"+post.id,
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
				actionLink: "/app/posts/"+post.id,
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
				actionLink: "/app/profile/"+currentUser.id,
	  		timestamp
	  	});
			setResult(result);
			await bindPosts(currentUser);
		}
	}

	const sharePost = async () => {
		await bindSharePost(currentUser, "id", {post});
		history.push("/app/posts/"+post.id);
	}

	const redirectToProfile = async () => {
		if (!hideRedirects) {
			history.push("/app/profile/"+post.userId);			
		}
	}

	const listenPost = () => {
		setIsTalking(true);
		if ('speechSynthesis' in window) {
			window.speechSynthesis.cancel();
			window.speechSynthesis.getVoices();
		}
		let speech = new SpeechSynthesisUtterance();
	  // Set the text and voice attributes.
		speech.text = post.text;
		speech.volume = 1;
		speech.rate = 1;
		speech.pitch = 0.8;
	  speech.voiceURI = 'native';
	  // speech.lang = locale;
		window.speechSynthesis.speak(speech);
		setIsTalking(false);
	}

  return postedUser && (
    <div className="card card-br-0 mb-4 pb-2">
	  	{
	  		result.status && <NotificationComponent result={result} setResult={setResult} />
	  	}
			<div className="media post-card-image p-2 text-secondary">
		  	<img className="mr-2" src={postedUser.photoURL || gtokFavicon} alt="Card img cap" onClick={e => redirectToProfile()}/>
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
			    <span className="font-small" title="Posted time">
			    <i className="fa fa-clock-o"></i>&nbsp;{moment(post.createdAt).fromNow()}
			    </span>
			    <span className="font-small ml-2" title="Post category">
			    <i className="fa fa-tag"></i>&nbsp;{!!post.category ? post.category.title : "General"}
			    </span>
			  </div>
		  </div>
		  <div className="card-body text-center">
		  	<p className="white-space-preline">{post.text}</p>
		  	<div>
				  <button className="btn btn-link btn-sm ml-2 fs-15 text-secondary" onClick={listenPost}>
				  	<i className={`fa fa-${isTalking ? "pause" : "play"}`}></i>
				  </button>
				  {followerLoading ? <i className="fa fa-spinner fa-spin"></i> :
					  <button className="btn btn-link btn-sm ml-2 fs-15" onClick={e => followPost(e)}>
				  		<i className={`fa fa-heart ${follower ? "text-danger" : "text-secondary"}`}></i> &nbsp;
				  		<span className={`${follower ? "text-danger" : "text-secondary"}`}>{post.followersCount}</span>
					  </button>
					}
				  {
				  	!hideShareBtn && 
					  <button className="btn btn-link btn-sm ml-2 fs-15 text-secondary" onClick={sharePost}>
					  	<i className="fa fa-share-alt"></i>
					  </button>
					}
		  	</div>
	  		<div className="mt-2 d-none">
			  <button className="btn btn-outline-secondary btn-sm ml-2 font-xs-small" onClick={listenPost}>
			  	<i className={`fa fa-${isTalking ? "pause" : "play"}`}></i>
			  </button>
		  	{
		  		currentUser.id !== post.userId &&
			  	<button className="btn btn-outline-secondary btn-sm font-xs-small ml-2" title="Number of similar people" onClick={e => followPost(e)}>
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
				    Similarities
			    </Link>
			  }
			  {
			  	!hideShareBtn && 
				  <button className="btn btn-outline-secondary btn-sm ml-2 font-xs-small" onClick={e => sharePost()}>
				  	<i className="fa fa-share-alt"></i>
				  </button>
			  }
			  </div>
		  </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
	return {
		bindPosts: (content) => dispatch(SetPosts(content)),
		bindSharePost: (content, type, data) => dispatch(SetSharePost(content, type, data))
	}
}

export default connect(
	null,
	mapDispatchToProps
)(DisplayPostComponent);