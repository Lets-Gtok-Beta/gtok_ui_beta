import React, { useState, useEffect } from "react";
import { useHistory, withRouter, Link } from 'react-router-dom';
import { connect } from "react-redux";

import { getId, getQuery, firestore } from "firebase_config";
import { capitalizeFirstLetter } from "helpers";
import { DisplayPostComponent, SimilarityComponent } from "components";
// import { CalendarChartData } from "constants/calendar"; CalendarComponent
import { gtokFavicon } from "images";
import { SetSelectedUserPosts, SetRelationships } from "store/actions";
import { createRelationships } from "lib/api";

function PublicProfileComponent(props) {
	const { currentUser, selectedUserPosts, bindPosts, allUsers, bindRelationships } = props;
	const userId = props.match.params.name;
	const [ displayUser, setDisplayUser ] = useState({});
	const [ loading, setLoading ] = useState(true);
	const [ tabContent, setTabContent ] = useState("");
	const [ follower, setFollower ] = useState(null);
	const [ isFollowerLoading, setIsFollowerLoading ] = useState(true);
	const [ bigImg, setBigImg ] = useState('');

	const history = useHistory();
	if (userId === currentUser.id ) history.push("/app/profile");

	useEffect(() => {
		if (!userId) { 
			setLoading(false);
			alert("No user found")
			return;
		}
		async function isFollower(user) {
			let rlns = await getQuery(
				firestore.collection("userRelationships").where("userIdOne", "==", currentUser.id).where("userIdTwo", "==", user.id).get()
			);
			if (rlns[0]) setFollower(rlns[0].status);
		}
		async function getUser() {
			let user = allUsers.find(user => user.id === userId);
			if (!user) {
				user = await getId("users", userId);
			}
			if (user && user.status === 404) setDisplayUser(null);
			else {
				user["id"] = userId;
				setDisplayUser(user)
				bindPosts(user);
			};
			isFollower(user);
			setLoading(false);
			setIsFollowerLoading(false);
		}
		getUser();
	}, [userId, bindPosts, currentUser, allUsers]);

	const relationStatus = async (status) => {
		setIsFollowerLoading(true);
		await createRelationships(currentUser, displayUser, status);
		await bindRelationships(currentUser);
		let rlns = await getQuery(
			firestore.collection("userRelationships").where("userIdOne", "==", currentUser.id).where("userIdTwo", "==", displayUser.id).get()
		);
		if (rlns[0]) setFollower(rlns[0].status);
		setIsFollowerLoading(false);
	}

  const msgUser = async () => {
  	history.push("/app/chats/new/"+displayUser.id);
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
					{
						bigImg &&
						<div className="profile_card_big_img" onClick={e => setBigImg("")}>
					  	<img className="mr-2" src={bigImg} alt="Card img cap" />
						</div>
					}
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
							<div className="btn-group">
					  		<button className={`btn btn-sm ${follower ? "btn-secondary" : "btn-outline-secondary"}`} onClick={e => relationStatus("follow")}>
						    {
						    	isFollowerLoading ? <i className="fa fa-spinner fa-spin"></i> : (
							    	<small className="pull-right">{
							    		follower === 0 ? "Pending" : (
							    		follower === 1 ? "Following" : (
							    			follower === 3 ? "Blocked" : "Follow"
							    		)
							    		)
							    	}</small>
							    )
						    }
						    </button>
							  <button type="button" className="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split pt-0 pb-0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							    <span className="sr-only">Toggle Dropdown</span>
							  </button>
							  <div className="dropdown-menu">
							  	{ follower === 0 &&
								    <button className="dropdown-item" onClick={e => relationStatus("cancel_request")}>
								    	Cancel Request
								    </button>}
							    { follower === 1 &&
							    	<button className="dropdown-item" onClick={e => relationStatus("unfollow")}>
							    		<i className="fa fa-times"></i>&nbsp;Unfollow
							    	</button>}
							    { follower !== 3 &&
							    	<button className="dropdown-item" onClick={e => relationStatus("block")}>
							    		<i className="fa fa-ban"></i>&nbsp; Block
							    	</button>}
							    { follower === 3 &&
							    	<button className="dropdown-item" onClick={e => relationStatus("unblock")}>
							    		<i className="fa fa-ban"></i>&nbsp; Unblock
							    	</button>}
							  </div>
							</div>
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
	      		<div className="mt-3">
	      			{
		      		!!selectedUserPosts[0] ? selectedUserPosts.map((post, idx) => (
		      			<DisplayPostComponent currentUser={currentUser} post={post} key={idx} hideSimilarityBtn={true} />
		      		)) : <div className="card text-center mt-2 p-2 text-secondary">No posts found</div>
		      		}
		      	</div>
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
	const { allUsers } = state.users;
	return { selectedUserPosts, allUsers };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindPosts: (content) => dispatch(SetSelectedUserPosts(content)),
		bindRelationships: (content) => dispatch(SetRelationships(content))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(PublicProfileComponent));