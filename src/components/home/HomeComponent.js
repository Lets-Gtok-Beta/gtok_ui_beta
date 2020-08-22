import React, { useState, useEffect } from "react";

import { add, get } from "firebase_config";
import { DisplayPostComponent } from "components";

const HomeComponent = ({currentUser}) => {
	const [ charCount, setCharCount ] = useState(143);
	const [ postType, setPostType ] = useState("help");
	const [ postText, setPostText ] = useState("");
	const [ category, setCategory ] = useState("");
	const [ postBtn, setPostBtn ] = useState("Post");
	let categories = ["Food habits", "Pet lovers", "Random"];

	const [ posts, setPosts ] = useState([]);

	useEffect(() => {
		async function getPosts() {
			let result = await get("posts");
			setPosts(result);
		}
		getPosts();
	}, []);

	const handleChange = (key, val) => {
		if (key === "post") {
			let chars = 143;
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
			text: postText.trim(),
			userId: currentUser.id,
			followers: []
		});
		if (result.status === 200) {
			setPostText("");
			setCategory("");
			setCharCount(143);
		}
		setPostBtn("Post");
	}

  return (
    <div className="container">
      <div className="card create-post-card">
      	<div className="d-flex">
      		<div className="col-6 font-xs-small card p-2 create-post-card-type" style={{backgroundColor: (postType === "help" ? "#eee" : "white")}} onClick={e => setPostType("help")}>Need help. Type here...</div>
      		<div className="col-6 font-xs-small card p-2 create-post-card-type" style={{backgroundColor: (postType !== "help" ? "#eee" : "white")}} onClick={e => setPostType("not-help")}>Else, Type here...</div>
      	</div>
      	{
      		postType && 
	      	<div className="">
			    	<textarea className="survey-textbox font-xs-small" rows={3} placeholder={postType === "help" ? "Share what help do you require. Ex: Needs a job..." : "Write something about yourself and find how many similar people around you. Ex: Love BBQ..."} maxLength="143" onChange={e => handleChange("post", e.target.value)} value={postText}></textarea>
						<div className="input-group px-1">
						  <div className="input-group-prepend">
						    <label className="input-group-text font-small" htmlFor="inputGroupSelect01">
						    This post is about your
						    </label>
						  </div>
						  <select className="custom-select font-small" id="inputGroupSelect01" onChange={e => handleChange("category", e.target.value)} value={category}>
						    <option defaultValue value="">Choose...</option>
						    {
						    	categories.map(category => (
						    		<option value={category} key={category}>{category}</option>
						    	))
						    }
						  </select>
						</div>
			    	<div className="px-1 py-2 pull-right">
			    		<button className="btn btn-secondary btn-sm pull-right" onClick={savePost} disabled={postBtn !== "Post"}>
			    		{postBtn}
			    		</button>
			    		{
			    			(charCount !== 143) &&
				    		<small className="pull-right pr-2 pt-1">{charCount} chars left</small>
			    		}
			    	</div>
			    </div>
			  }
	    </div>

	    {
	    	posts[0] && posts.map((post, idx) => (
		    	<DisplayPostComponent currentUser={currentUser} post={post} key={idx} />
	    	))
	    }
    </div>
  );
};

export default HomeComponent;