import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { add, timestamp } from "firebase_config";
import { 
	DisplayPostComponent,
	GeneratePostComponent,
	NotificationComponent
} from "components";
import { PostCategories } from "constants/categories";
import { SetPosts } from "store/actions";

const HomeComponent = ({currentUser, posts, bindPosts}) => {
	const [ charCount, setCharCount ] = useState(500);
	const [ postType, setPostType ] = useState(false);
	const [ postText, setPostText ] = useState("");
	const [ category, setCategory ] = useState("");
	const [ postBtn, setPostBtn ] = useState("Post");
	const [ generatePost, setGeneratePost ] = useState(false);
	const [ result, setResult ] = useState({});

	useEffect(() => {
		if (!posts[0]) bindPosts(currentUser);
	}, [bindPosts, currentUser, posts]);

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
		let result = await add("posts", {
			active: true,
			text: postText.trim(),
			userId: currentUser.id,
			followers: [],
			followersCount: 0,
			category: PostCategories.find(c => c.title === category),
			timestamp
		});
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
			setPostText("");
			setCategory("");
			setCharCount(500);
		}
		setResult(result);
		setPostBtn("Post");
		bindPosts(currentUser);
	}

  return (
    <div className="container">
	  	{
	  		result.status && <NotificationComponent result={result} setResult={setResult} />
	  	}
      <div className="card create-post-card mt-2 mb-4">
      {/*
      	<div className="d-flex">
      		<div className="col-6 font-xs-small card p-2 create-post-card-type" style={{backgroundColor: (postType !== "bot" ? "#eee" : "white")}} onClick={e => setPostType("human")}><i className="fa fa-pencil"></i>&nbsp;Type a post</div>
      		<div className="col-6 font-xs-small card p-2 create-post-card-type" style={{backgroundColor: (postType === "bot" ? "#eee" : "white")}} onClick={e => setPostType("bot")}>Automate a post</div>
      	</div>
      */}
      	<div className="d-flex">
      		<div className="col-12 font-xs-small card p-2 create-post-card-type" style={{backgroundColor: (postType ? "#eee" : "white")}} onClick={e => setPostType(!postType)}>
      			<div className="d-flex align-self-center">
      				<i className="fa fa-pencil pr-1 mt-1"></i> &nbsp;
      				<span>Share an experience / Pinch a feeling{!postType && ". Click here"}
      				</span>
      			</div>
      		</div>
      	</div>
      	{
      		postType === "bot" &&
      		<div className="">
      			<p className="p-3 px-md-5 text-center text-secondary">
      			Answer few questions and our Gtok Bot generates a post for you.<br/>
      			<button className="btn btn-link text-center" onClick={e => setGeneratePost(true)}>
      			Generate Post
      			</button>
      			</p>
      		</div>
      	}
      	{
      		postType &&
	      	<div className="create-post">
			    	<textarea className="post-textbox font-xs-small" rows={3} placeholder="Start typing here.. Ex: Love BBQ, BMW is my favorite car..." maxLength="500" onChange={e => handleChange("post", e.target.value)} value={postText}></textarea>
						<div className="input-group px-1">
						  <div className="input-group-prepend">
						    <label className="input-group-text font-small" htmlFor="inputGroupSelect01">
						    This post is about your
						    </label>
						  </div>
						  <select className="custom-select font-small" id="inputGroupSelect01" onChange={e => handleChange("category", e.target.value)} value={category}>
						    <option defaultValue value="">Choose...</option>
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
			    		<button className="btn btn-secondary btn-sm pull-right" onClick={savePost} disabled={postBtn !== "Post"}>
			    		{postBtn}
			    		</button>
			    		{
			    			(charCount !== 500) &&
				    		<small className="pull-right pr-2 pt-1">{charCount} chars left</small>
			    		}
			    	</div>
			    </div>
			  }
	    </div>
	    {
	    	posts[0] && posts.map((post, idx) => (
		    	<DisplayPostComponent currentUser={currentUser} post={post} key={idx} setResult={setResult}/>
	    	))
	    }
			{
				generatePost && <GeneratePostComponent setOpenModal={setGeneratePost} currentUser={currentUser} />
			}
		</div>
  );
};

const mapStateToProps = (state) => {
	const { posts } = state.posts;
	return { posts };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindPosts: (content) => dispatch(SetPosts(content))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomeComponent);