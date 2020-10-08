import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { add, update, timestamp } from "firebase_config";
import { 
	NotificationComponent
} from "components";
import { PostCategories } from "constants/categories";
import { capitalizeFirstLetter } from "helpers";
import { gtokFavicon, gtokBot } from "images";
import { SetNewPost } from "store/actions";

const CreatePostComponent = (props) => {
	let sharePostText = (props.history.location.state && props.history.location.state.sharePostText) || "";
	let sharePostCategory = (props.history.location.state && props.history.location.state.sharePostCategory && props.history.location.state.sharePostCategory.title) || "";
	let sharePostId = (props.history.location.state && props.history.location.state.sharePostId) || "";
	const { currentUser, bindNewPost } = props;
	const [ charCount, setCharCount ] = useState(500-sharePostText.length);
	const [ postText, setPostText ] = useState(sharePostText);
	const [ category, setCategory ] = useState(sharePostCategory);
	const [ postBtn, setPostBtn ] = useState("Post");
	const [ result, setResult ] = useState({});

	const handleChange = (key, val) => {
		if (key === "post") {
			let chars = 500;
			setCharCount(chars - val.length);
			setPostText(val);
		}
		if (key === "category") {
			setCategory(val);
		}
	}

	const savePost = async () => {
		if (!postText) {
			alert("Write something before you post");
			return null;
		}
		if (!category) {
			alert("Please select a category");
			return null;
		}
		setPostBtn("Posting");
		let result = "";
		if (sharePostId) {
			let postData = {
				text: postText.trim(),
				category: PostCategories.find(c => c.title === category),
				categoryId: PostCategories.find(c => c.title === category).id
			}
			result = await update("posts", sharePostId, postData);
			postData = Object.assign(postData, {id: sharePostId});
  		await bindNewPost(postData);
		} else {
			let postData = {
				active: true,
				text: postText.trim(),
				userId: currentUser.id,
				followers: [],
				followersCount: 0,
				category: PostCategories.find(c => c.title === category),
				categoryId: PostCategories.find(c => c.title === category).id,
				timestamp
			}
			result = await add("posts", postData);
		}
  	/* Log the activity */
  	await add("logs", {
  		text: `${currentUser.displayName} created a post`,
  		photoURL: currentUser.photoURL,
  		receiverId: "",
  		userId: currentUser.id,
  		actionType: "create",
  		collection: "posts",
  		timestamp
  	});
		if (result.status === 200) {
			props.history.push({
				pathname: "/app/posts",
				state: { postingSuccess: true, reloadPosts: true }
			});
		} else {
			setResult(result);
			setPostBtn("Post");
		}
	}

	const cancelPost = () => {
		props.history.push("/app/posts");
	}

  return (
    <div className="container">
	  	{
	  		result.status && <NotificationComponent result={result} setResult={setResult} />
	  	}
	  	<div className="row">
	    	<div className="d-none col-md-2 d-md-block mt-2">
	    		<div className="card left-sidebar-wrapper">
	    			<div className="card-body">
	    				<div className="profile-details">
	    					<Link to="/app/profile">
									<img 
										src={currentUser.photoURL || gtokFavicon}
										alt="dp" 
										className="profile-pic"
									/>
									<h5 className="profile-name">
										{currentUser.displayName && capitalizeFirstLetter(currentUser.displayName)}
									</h5>
								</Link>
							</div>
							<hr/>
							<div className="d-flex create-post">
								<Link to="/app/create_post">
									<i className="fa fa-pencil"></i> &nbsp;
									<small className="bot-text">Share an experience</small>
								</Link>
							</div>
	    			</div>
	    		</div>
	    	</div>
	    	<div className="col-xs-12 col-md-7">
		      <div className="card create-post-card mt-2 mb-4">
		      	<div className="d-flex">
		      		<div className="col-12 font-xs-small card p-2 create-post-card-type" style={{backgroundColor: "#eee"}}>
		      			<div className="d-flex align-self-center">
		      				<i className="fa fa-pencil pr-1 mt-1"></i> &nbsp;
		      				<span>Share an experience / Pinch a feeling
		      				</span>
		      			</div>
		      		</div>
		      	</div>
		      	<div className="create-post">
				    	<textarea className="post-textbox font-xs-small" rows={5} placeholder="Start typing here.. Ex: Love BBQ, BMW is my favorite car..." maxLength="500" onChange={e => handleChange("post", e.target.value)} value={postText}></textarea>
							<div className="input-group px-1">
							  <div className="input-group-prepend">
							    <label className="input-group-text font-small" htmlFor="inputGroupSelect01">
							    This post is about your
							    </label>
							  </div>
							  <select className="custom-select font-small" id="inputGroupSelect01" onChange={e => handleChange("category", e.target.value)} value={category}>
							    <option value="">Choose...</option>
							    {
							    	PostCategories.map(category => (
							    		<option value={category.title} key={category.key}>
							    		{category.title}
							    		</option>
							    	))
							    }
							  </select>
							</div>
				    	<div className="px-1 py-2 pull-right">
				    		<button className="btn btn-outline-secondary btn-sm pull-right ml-2" onClick={cancelPost} disabled={postBtn !== "Post"}>
				    		Cancel
				    		</button>
				    		<button className="btn btn-secondary btn-sm pull-right" onClick={savePost} disabled={postBtn !== "Post"}>
				    		{postBtn}
				    		</button>
				    		{
				    			(charCount !== 500) &&
					    		<small className="pull-right pr-2 pt-1">{charCount} chars left</small>
				    		}
				    	</div>
				    </div>
			    </div>
		    </div>
	    	<div className="d-none col-md-3 d-md-block mt-2">
	    		<div className="card right-sidebar-wrapper">
	    			<div className="card-body">
							<div className="d-flex profile-bot">
								<img src={gtokBot} alt="gtokBot" className="bot-icon" />
								<small className="bot-text">Your personal friend</small>
							</div>
							<hr/>
							<p className="profile-bot-description">
								Hi! I am your personal friend (a bot). I can chat, work and help you in daily activities. I am so happy to be your personal friend, {currentUser.displayName.split(" ")[0].toUpperCase()}. Will ping you once I am ready to chat...
							</p>
	    			</div>
	    		</div>
	    	</div>
	  	</div>
		</div>
  );
};

const mapDispatchToProps = (dispatch) => {
	return {
		bindNewPost: (content) => dispatch(SetNewPost(content))
	}
}

export default connect(
	null,
	mapDispatchToProps
)(withRouter(CreatePostComponent));