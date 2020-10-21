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
	removeFile,
	timestamp
} from "firebase_config";
import { gtokFavicon } from "images";
import { capitalizeFirstLetter } from "helpers";
import { SetPosts, SetSharePost, SetUpdatedPost } from "store/actions";
import { NotificationComponent } from "components";
import { PostCategories } from "constants/categories";

const DisplayPostComponent = ({
	currentUser, post, bindPosts, hideSimilarityBtn=false, bindSharePost, hideShareBtn=false, hideRedirects=false, allUsers, bindUpdatedPost
}) => {
	const [ displayPost, setDisplayPost ] = useState(post);
	const [ postedUser, setPostedUser ] = useState("");
	const [ follower, setFollower ] = useState(!!displayPost.followers.find(f => f === currentUser.id));
	const [ followersCount, setFollowersCount ] = useState(displayPost.followers.length);
	const [ followerLoading, setFollowerLoading ] = useState(false);
	const [ result, setResult ] = useState({});
	const [ isTalking, setIsTalking ] = useState(false);
	const history = useHistory();

	useEffect(() => {
		async function getPostedUser() {
			let result = allUsers.find(user => user.id === displayPost.userId);
			if (!result) {
				result = await getId("users", displayPost.userId);
			}
			result["id"] = displayPost.userId;
			setPostedUser(result);
		}
		getPostedUser();
	}, [displayPost, allUsers]);

	const followPost = async (e) => {
		// if (currentUser.id === postedUser.id) {
		// 	alert("You cannot follow yourself.")
		// 	return null;
		// }
		setFollowerLoading(true);
  	if (!follower) {
	  	await update("posts", displayPost.id, { followers: arrayAdd(currentUser.id), followersCount: displayPost.followers.length+1 });
  		/* Log the activity */
	  	await add("logs", {
	  		text: `${currentUser.displayName} pinches your post`,
	  		photoURL: currentUser.photoURL,
	  		receiverId: postedUser.id,
	  		userId: currentUser.id,
	  		actionType: "update",
	  		collection: "posts",
	  		actionId: displayPost.id,
	  		actionKey: "followers",
	  		actionLink: "/app/posts/"+displayPost.id,
	  		timestamp
	  	});
	  	setFollower(true);
  	} else {
	  	await update("posts", displayPost.id, { followers: arrayRemove(currentUser.id), followersCount: displayPost.followers.length-1 });
  		/* Log the activity */
	  	await add("logs", {
	  		text: `${currentUser.displayName} removed pinch for your post`,
	  		photoURL: currentUser.photoURL,
	  		receiverId: "",
	  		userId: currentUser.id,
	  		actionType: "update",
	  		collection: "posts",
	  		actionId: displayPost.id,
	  		actionKey: "followers",
				actionLink: "/app/posts/"+displayPost.id,
	  		timestamp
	  	});
	  	setFollower(false);
  	}
  	await getUpdatedPost(displayPost.id)
  	setFollowerLoading(false);
	}

	const selectCategory = (id) => {
		let category = PostCategories.find(c => c.id === id);
		return category.title;
	}

	const getUpdatedPost = async (id) => {
		await bindUpdatedPost(currentUser, "id", {id});
		let res = await getId("posts", id);
		setFollowersCount(res.followers.length);
	}

	const deletePost = async (post) => {
		if (post.id && window.confirm("Are you sure to delete this post?")) {
			let result = await remove("posts", post.id);
			/* Wants to remove a post inside a thread */
			if (post.prevId) {
				await update("posts", post.prevId, { nextId: post.nextId || null });
			}
			if (post.nextId) {
				await update("posts", post.nextId, { prevId: post.prevId || null });
			}
			if (displayPost.fileUrl) {
				await removeFile(displayPost.fileUrl);
			}
  		/* Log the activity */
	  	await add("logs", {
	  		text: `${currentUser.displayName} removed the post`,
	  		photoURL: currentUser.photoURL,
	  		receiverId: "",
	  		userId: currentUser.id,
	  		actionType: "delete",
	  		collection: "posts",
	  		actionId: displayPost.id,
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
		history.push("/app/posts/"+displayPost.id);
	}

	const redirectToProfile = async () => {
		if (!hideRedirects) {
			history.push("/app/profile/"+displayPost.userId);			
		}
	}

	const listenPost = () => {
		setIsTalking(true);
		if ('speechSynthesis' in window) {
			window.speechSynthesis.cancel();
			setTimeout(() => {
			let voices = window.speechSynthesis.getVoices();
			let speech = new SpeechSynthesisUtterance(displayPost.text);
		  // Set the text and voice attributes.
			// speech.text = displayPost.text;
			speech.volume = 1;
			speech.rate = 0.8;
			speech.pitch = 1;
		  speech.voice = voices.find(v => v.lang === "hi-IN");
		  // speech.lang = locale;
			window.speechSynthesis.speak(speech);
			}, 10);
		} else {
			alert('This feature is not supported in this device');
		}
		setIsTalking(false);
	}

	const editPost = (post) => {
		history.push({
  		pathname: "/app/create_post",
  		state: {
  			sharePostText: post.text,
  			sharePostCategory: post.category,
  			sharePostId: post.id,
  			sharePostAudioUrl: post.fileUrl
  		}
  	});
	}

	const createPost = (post) => {
		history.push({
  		pathname: "/app/create_post",
  		state: {
  			sharePostCategory: displayPost.category,
  			sharePostId: displayPost.id,
  			isThread: true
  		}
  	});
	}

	const getPost = async (id) => {
		let pst = await getId("posts", id);
		pst["id"] = id;
		setDisplayPost(pst);
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
			    		(displayPost.userId === currentUser.id) &&
	    				<div className="dropdown p-0 pull-right post-menu-dropdown">
	    					<i className="fa fa-angle-down post-menu-icon" data-toggle="dropdown"></i>
	    					<div className="dropdown-menu post-menu-options">
					        <button className="dropdown-item btn-link" onClick={e => editPost(displayPost)}>
					        	Edit
					        </button>
					        <button className="dropdown-item btn-link" onClick={e => deletePost(displayPost)}>
					        	Delete
					        </button>
					      </div>
	    				</div>
			    	}
			    </h6>
			    <span className="font-small" title="Posted time">
			    <i className="fa fa-clock-o"></i>&nbsp;{moment(displayPost.createdAt).fromNow()}
			    </span>
			    <span className="font-small ml-2" title="Post category">
			    <i className="fa fa-tag"></i>&nbsp;{selectCategory(displayPost.categoryId)}
			    </span>
			  </div>
		  </div>
		  <div className="card-body text-center">
		  	<p className="white-space-preline">{displayPost.text}</p>
  			{ displayPost.fileUrl &&
	    		<audio src={displayPost.fileUrl} controls controlsList="nodownload"></audio>
				}
				<div className="row align-items-center continue-posts">
					<div className="col-2">
					  <button className={`btn btn-link btn-sm ml-2 text-secondary left-btn ${!displayPost.prevId && "d-none"}`} onClick={e => getPost(displayPost.prevId)}>
					  	<i className="fa fa-angle-left"></i>
					  </button>
					</div>
					<div className="col-7">
					  <button className={`btn btn-link btn-sm ml-2 fs-15 text-secondary flex-grow-1 ${!(displayPost.userId === currentUser.id && !displayPost.nextId) && "d-none"}`} onClick={e => createPost(displayPost)}>
					  	<i className="fa fa-plus"></i>&nbsp; Continue
					  </button>
					</div>
					<div className="col-3">
					  <button className={`btn btn-link btn-sm ml-2 text-secondary left-btn ${!displayPost.nextId && "d-none"}`} onClick={e => getPost(displayPost.nextId)}>
					  	<i className="fa fa-angle-right"></i>
					  </button>
					</div>
				</div>
			</div>
			<div className="post-card-footer">
			  <button className="btn btn-link btn-sm ml-2 fs-15 text-secondary" onClick={listenPost}>
			  	<i className={`fa fa-${isTalking ? "pause" : "play"}`}></i>
			  </button>
			  {followerLoading ? <i className="fa fa-spinner fa-spin"></i> :
				  <button className="btn btn-link btn-sm ml-2 fs-15" onClick={e => followPost(e)}>
			  		<i className={`fa fa-heart ${follower ? "text-danger" : "text-secondary"}`}></i> &nbsp;
			  		<span className={`${follower ? "text-danger" : "text-secondary"}`}>{followersCount}</span>
				  </button>
				}
			  {
			  	!hideShareBtn && 
				  <button className="btn btn-link btn-sm ml-2 fs-15 text-secondary" onClick={sharePost}>
				  	<i className="fa fa-share-alt"></i>
				  </button>
				}
	  		<div className="mt-2 d-none">
			  <button className="btn btn-outline-secondary btn-sm ml-2 font-xs-small" onClick={listenPost}>
			  	<i className={`fa fa-${isTalking ? "pause" : "play"}`}></i>
			  </button>
		  	{
		  		currentUser.id !== displayPost.userId &&
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
		  		currentUser.id !== displayPost.userId && !hideSimilarityBtn &&
			    <Link to={"/app/profile/"+displayPost.userId} className="btn btn-outline-secondary btn-sm ml-2 font-xs-small" title={"Show similarities with "+postedUser.displayName && postedUser.displayName.split(" ")[0]}>
			    	<i className="fa fa-bar-chart"></i> &nbsp;
				    Similarities
			    </Link>
			  }
			  {/*
			  	!hideShareBtn && 
				  <button className="btn btn-outline-secondary btn-sm ml-2 font-xs-small" onClick={e => sharePost()}>
				  	<i className="fa fa-share-alt"></i>
				  </button>*/
			  }
			  </div>
		  </div>
    </div>
  );
};

const mapStateToProps = (state) => {
	const { allUsers } = state.users;
	return { allUsers };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindPosts: (content) => dispatch(SetPosts(content)),
		bindSharePost: (content, type, data) => dispatch(SetSharePost(content, type, data)),
		bindUpdatedPost: (content, type, data) => dispatch(SetUpdatedPost(content, type, data)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DisplayPostComponent);