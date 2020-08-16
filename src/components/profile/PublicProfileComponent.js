import React, { useState, useEffect } from "react";
import { useHistory, withRouter, Link } from 'react-router-dom';

import { getId } from "firebase_config";
import { capitalizeFirstLetter } from "helpers";
// import { CalendarComponent } from "components";
// import { CalendarChartData } from "constants/calendar";
import { gtokFavicon } from "images";

function PublicProfileComponent(props) {
	const { premium } = props.currentUser;
	const userId = props.match.params.name;
	const [ displayUser, setDisplayUser ] = useState();
	const [ loading, setLoading ] = useState(true);

	useEffect(() => {
		if (!userId) { 
			setLoading(false);
			alert("No user found")
			return;
		}
		async function getUser() {
			let user = await getId("users", userId);
			if (user && user.status === 404) setDisplayUser(null);
			else setDisplayUser(user);
			setLoading(false);
		}
		getUser();
	}, [userId]);
  const history = useHistory();

  const displayFollowers = async () => {
  	if (!premium) {
	  	alert("You cannot see other followers.");
	  	return;
  	}
  }

  const msgUser = async () => {
  	if (!premium) {
  		alert("Upgrade to premium to message others");
  		return null;
  	}
  	history.push("/app/chats/new/"+displayUser.id);
  }

	return (
	  <div className="container-fluid">
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
						<div className="d-flex justify-content-center mt-2">
							<button className="btn btn-sm btn-secondary" onClick={e => displayFollowers(e)}>
								Followers <span className="badge badge-light">{displayUser && displayUser.followers && displayUser.followers.length}</span>
							</button>
					    <button className="btn btn-sm btn-outline-secondary ml-2 btn_send_text" onClick={e => msgUser()} title="Send text">
					    	<i className="fa fa-comment"></i>
						  </button>
						</div>
				  </div>
					<div>
						<div className="form-group row">
					    <label htmlFor="userName" className="col-sm-2 col-form-label">Name</label>
					    <div className="col-sm-10">
					    	{displayUser && displayUser.displayName && capitalizeFirstLetter(displayUser.displayName)}
					    </div>
					  </div>
					  {
					  	displayUser.permissions && displayUser.permissions.private ? "" :
							<div className="form-group row">
						    <label htmlFor="dob" className="col-sm-2 col-form-label">Date of birth</label>
						    <div className="col-sm-10">
						    	{displayUser.dob}
						    </div>
						  </div>
					  }
					  {
					  	displayUser.permissions && displayUser.permissions.private ? "" :
							<div className="form-group row">
						    <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Email</label>
						    <div className="col-sm-10">
						    	{displayUser.email} &nbsp;
						    </div>
						  </div>
					  }
					{/*
						<div className="">
							Today, 0% similarity
							<CalendarComponent data={CalendarChartData} startDate="2020-07-01" />
						</div>
					*/}
					</div>
				</div>
	  	}
	  </div>
	);
}

export default withRouter(PublicProfileComponent);