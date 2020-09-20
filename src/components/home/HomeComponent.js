import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { 
	DisplayPostComponent,
	GeneratePostComponent
} from "components";
import { SetPosts } from "store/actions";
import { capitalizeFirstLetter } from "helpers";
import { gtokFavicon, gtokBot } from "images";

const HomeComponent = (props) => {
	const { currentUser, posts, bindPosts } = props;
	const [ generatePost, setGeneratePost ] = useState(false);
	let propsState = props.history.location.state || {};
	const [ reloadPosts, setReloadPosts ] = useState(propsState.reloadPosts || false);

	useEffect(() => {
		if (!posts[0]) bindPosts(currentUser);
		if (reloadPosts) {
			bindPosts(currentUser);
			setReloadPosts(false);
		}
	}, [bindPosts, currentUser, posts, propsState, reloadPosts]);

  return (
    <div className="container">
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
		      {/*
		      	<div className="d-flex">
		      		<div className="col-6 font-xs-small card p-2 create-post-card-type" style={{backgroundColor: (postType !== "bot" ? "#eee" : "white")}} onClick={e => setPostType("human")}><i className="fa fa-pencil"></i>&nbsp;Type a post</div>
		      		<div className="col-6 font-xs-small card p-2 create-post-card-type" style={{backgroundColor: (postType === "bot" ? "#eee" : "white")}} onClick={e => setPostType("bot")}>Automate a post</div>
		      	</div>
		      */}
		      	<div className="d-flex">
		      		<div className="col-12 font-xs-small card p-2 create-post-card-type" style={{backgroundColor: "white"}} onClick={e => props.history.push("/app/create_post")}>
		      			<div className="d-flex align-self-center">
		      				<i className="fa fa-pencil pr-1 mt-1"></i> &nbsp;
		      				<span>Share an experience / Pinch a feeling. Click here</span>
		      			</div>
		      		</div>
		      	</div>
		      	{/*
		      		postType === "bot" &&
		      		<div className="">
		      			<p className="p-3 px-md-5 text-center text-secondary">
		      			Answer few questions and our Gtok Bot generates a post for you.<br/>
		      			<button className="btn btn-link text-center" onClick={e => setGeneratePost(true)}>
		      			Generate Post
		      			</button>
		      			</p>
		      		</div>*/
		      	}
			    </div>
			    {
			    	posts[0] && posts.map((post, idx) => (
				    	<DisplayPostComponent currentUser={currentUser} post={post} key={idx}/>
			    	))
			    }
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
				{
					generatePost && <GeneratePostComponent setOpenModal={setGeneratePost} currentUser={currentUser} />
				}
			</div>
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
)(withRouter(HomeComponent));