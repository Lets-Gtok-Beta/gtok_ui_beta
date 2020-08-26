import React, { useState, useEffect } from "react";
import { useHistory, withRouter, Link } from 'react-router-dom';
import { connect } from "react-redux";

import { add, getId, update, arrayAdd, arrayRemove, timestamp } from "firebase_config";
import { capitalizeFirstLetter } from "helpers";
import { DisplayPostComponent, SimilarityComponent } from "components";
// import { CalendarChartData } from "constants/calendar"; CalendarComponent
import { gtokFavicon } from "images";
import { SetSelectedUserPosts } from "store/actions";

function PublicProfileComponent(props) {
	const { currentUser, selectedUserPosts, bindPosts } = props;
	const userId = props.match.params.name;
	const [ displayUser, setDisplayUser ] = useState();
	const [ loading, setLoading ] = useState(true);
	const [ tabContent, setTabContent ] = useState("");
	const [ follower, setFollower ] = useState(false);
	const [ isFollowerLoading, setIsFollowerLoading ] = useState(true);

	const history = useHistory();
	if (userId === currentUser.id ) history.push("/app/profile");

	useEffect(() => {
		if (!userId) { 
			setLoading(false);
			alert("No user found")
			return;
		}
		async function getUser() {
			let user = await getId("users", userId);
			if (user && user.status === 404) setDisplayUser(null);
			else {
				user["id"] = userId;
				setDisplayUser(user)
				bindPosts(user);
				let isfollow = user.followers.find(id => id === currentUser.id);
				if (!!isfollow) setFollower(true);
			};
			setLoading(false);
			setIsFollowerLoading(false);
		}
		getUser();
	}, [userId, bindPosts, currentUser]);

  // const displayFollowers = async () => {
  // 	if (!currentUser.premium) {
	 //  	alert("You cannot see followers.");
	 //  	return;
  // 	}
  // }

  const msgUser = async () => {
  	history.push("/app/chats/new/"+displayUser.id);
  }

  const followUser = async () => {
  	setIsFollowerLoading(true);
  	if (!follower) {
	  	await update("users", displayUser.id, { followers: arrayAdd(currentUser.id) });
	  	/* Alert display user about current user */
	  	await add("logs", {
	  		text: `${currentUser.displayName} followed you`,
	  		photoURL: currentUser.photoURL,
	  		receiverId: displayUser.id,
	  		userId: currentUser.id,
	  		actionType: "update",
	  		collection: "users",
	  		actionId: displayUser.id,
	  		actionKey: "followers",
	  		timestamp
	  	});
	  	setFollower(true);
  	} else {
	  	await update("users", displayUser.id, { followers: arrayRemove(currentUser.id) });
	  	/* Alert display user about current user */
	  	await add("logs", {
	  		text: `${currentUser.displayName} unfollowed you`,
	  		photoURL: currentUser.photoURL,
	  		receiverId: "",
	  		userId: currentUser.id,
	  		actionType: "update",
	  		collection: "users",
	  		actionId: displayUser.id,
	  		actionKey: "followers",
	  		timestamp
	  	});
	  	setFollower(false);
  	}
  	setIsFollowerLoading(false);
  }


	return (
	  <div className="container">
	  	{
	  		loading ? <div className="text-center">
	  			<i className="fa fa-spinner fa-spin"></i>
	  		</div> :
	  		!displayUser ? <div className="text-center">
	  			<h5><b>No user found</b></h5>
	  			<Link to="/app/search">Goto Search</Link>
	  		</div> :
	  		<div>
					<div className="text-center mb-3">
						<img 
							src={ displayUser.photoURL || gtokFavicon}
							alt="dp" 
							className="profilePic"
						/>
						<h5 className="mb-0 mt-2">
							{displayUser.displayName && capitalizeFirstLetter(displayUser.displayName)}
						</h5>
						<button className="btn btn-link text-secondary btn-sm py-0" onClick={e => alert("Followers will not display at the moment. Come back later.")}>
							{displayUser.followers && displayUser.followers.length} follower{displayUser.followers && displayUser.followers.length !== 1 && "s"}
						</button>
						<div className="d-flex justify-content-center mt-2">
				  		<button className={`btn btn-sm ${follower ? "btn-secondary" : "btn-outline-secondary"}`}>
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
						</div>
				  </div>
		      <div className="card create-post-card">
		      	<div className="d-flex">
		      		<div className="col-6 font-xs-small card p-2 create-post-card-type" style={{backgroundColor: (tabContent !== "posts" ? "#eee" : "white")}} onClick={e => setTabContent("")}>
		      			<div className="d-flex flex-row">
		      				<i className="fa fa-bar-chart pr-1 mt-1"></i>
		      				<span>Similarities</span>
		      			</div>
		      		</div>
		      		<div className="col-6 font-xs-small card p-2 create-post-card-type" style={{backgroundColor: (tabContent === "posts" ? "#eee" : "white")}} onClick={e => setTabContent("posts")}>
		      			<div className="d-flex flex-row">
		      				<i className="fa fa-pencil pr-1 mt-1"></i>
		      				<span>Posts</span>
		      			</div>
		      		</div>
		      	</div>
		      </div>
	      	{
	      		tabContent === "posts" ?
	      		!!selectedUserPosts[0] ? selectedUserPosts.map((post, idx) => (
	      			<DisplayPostComponent currentUser={currentUser} post={post} key={idx} hideSimilarityBtn={true} />
	      		)) : <div className="card text-center mt-2 p-2 text-secondary">No posts found</div>
	      		:
	      		displayUser.id && <SimilarityComponent currentUser={currentUser} selectedUser={displayUser} />
	      	}
					{/*
						<div className="">
							Today, 0% similarity
							<CalendarComponent data={CalendarChartData} startDate="2020-07-01" />
						</div>
					*/}
				</div>
	  	}
	  </div>
	);
}

const mapStateToProps = (state) => {
	const { selectedUserPosts } = state.posts;
	return { selectedUserPosts };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindPosts: (content) => dispatch(SetSelectedUserPosts(content))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(PublicProfileComponent));