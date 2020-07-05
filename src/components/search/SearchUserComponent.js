import React, { useState, useContext, useEffect } from "react";
import { useHistory, Link } from 'react-router-dom';
import { NotificationComponent } from "components";
import { firestore, getQuery, getId, update, arrayAdd, arrayRemove } from "firebase_config";

const SearchUserComponent = ({displayUser, authUser}) => {
	const [ user, setUser ] = useState(displayUser);
	const [ follower, setFollower ] = useState(false);
	const [ isFollowerLoading, setIsFollowerLoading ] = useState(true);
	const [ result, setResult ] = useState({});

	useEffect(() => {
	  const isFollower = async () => {
	  	let f = await displayUser.followers.find(f => f == authUser.id);
	  	setIsFollowerLoading(false);
	  	setFollower(!!f)
	  }
		isFollower();
	}, []);

  const followUser = async (user) => {
  	setResult({status: 100, message: "Processing..."});
  	let res = await update("users", user.id, { followers: arrayAdd(authUser.id) });
  	setResult(res);
  	setFollower(true);
  }

  const unFollowUser = async (user) => {
  	setResult({status: 100, message: "Processing..."});
  	let res = await update("users", user.id, { followers: arrayRemove(authUser.id) });
  	setResult(res);
  	setFollower(false);
  }

  return (
		<div className="col-xs-12 col-sm-3 col-md-2 mt-3">
			<div className="card">
				{result.status && <NotificationComponent result={result} setResult={setResult} />}
			  <img className="card-img-top" src={user.photoURL || "../logo192.png"} alt="Card image cap" />
			  <div className="card-body">
			    <h5 className="card-title">{user.displayName || "No name"}</h5>
			    <div>
				    <button className="btn btn-link btn-sm pl-0">Check similarities</button>
				    {
				    	isFollowerLoading ? <i className="fa fa-spinner"></i> : (
					    	follower ? <i className="fa fa-minus pull-right" onClick={e => unFollowUser(user)}></i> : <i className="fa fa-plus pull-right" onClick={e => followUser(user)}></i>
					    )
				    }
				  </div>
			  </div>
			</div>
		</div>
  );
};

export default SearchUserComponent;