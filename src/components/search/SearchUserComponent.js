import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { NotificationComponent, CheckSimilarityComponent } from "components";
import { update, arrayAdd, arrayRemove } from "firebase_config";

const SearchUserComponent = ({displayUser, currentUser}) => {
	const history = useHistory();
	const [ follower, setFollower ] = useState(false);
	const [ isFollowerLoading, setIsFollowerLoading ] = useState(true);
	const [ result, setResult ] = useState({});
	const [ openSimilarities, setOpenSimilarities ] = useState(false);
	const [ selectedUser, setSelectedUser ] = useState({});

	useEffect(() => {
	  const isFollower = async () => {
	  	let f = await displayUser.followers.find(f => f === currentUser.id);
	  	setIsFollowerLoading(false);
	  	setFollower(!!f)
	  }
		isFollower();
	}, [currentUser.id, displayUser.followers]);

  const followUser = async () => {
  	setResult({status: 100, message: "Processing..."});
  	let res = await update("users", displayUser.id, { followers: arrayAdd(currentUser.id) });
  	setResult(res);
  	setFollower(true);
  }

  const unFollowUser = async () => {
  	setResult({status: 100, message: "Processing..."});
  	let res = await update("users", displayUser.id, { followers: arrayRemove(currentUser.id) });
  	setResult(res);
  	setFollower(false);
  }

  const openModal = (selectedUser) => {
  	setSelectedUser(selectedUser);
  	setOpenSimilarities(true);
  }

  const msgUser = async () => {
  	if (!currentUser.premium) {
  		alert("Upgrade to premium to message others");
  		return null;
  	}
  	history.push("/app/chats/new/"+displayUser.id);
  }

  return (
		<div className="col-xs-12 col-sm-3 col-md-2 mt-3">
			<div className="card">
				{result.status && <NotificationComponent result={result} setResult={setResult} />}
				<div className="profile-card-img">
			  	<img src={displayUser.photoURL || "../logo192.png"} alt="Card img cap" />
			  	<div className="img-bottom">
			  		<button className="btn btn-sm btn-danger">
				    {
				    	isFollowerLoading ? <i className="fa fa-spinner"></i> : (
					    	follower ? <small className="pull-right" onClick={e => unFollowUser()}>Unfollow</small> : <small className="pull-right" onClick={e => followUser()}>Follow</small>
					    )
				    }
				    </button>
			  	</div>
			  </div>
			  <div className="card-body">
			    <h5 className="card-title">{displayUser.displayName || "No name"}</h5>
			    <div>
				    <button className="btn btn-link btn-sm pl-0" onClick={e => openModal(displayUser)}>
				    Check similarities
				    </button>
			    	<i className="fa fa-envelope pull-right text-primary" onClick={e => msgUser()}></i>
				  </div>
			  </div>
			</div>
			{openSimilarities && selectedUser && <CheckSimilarityComponent setOpenModal={setOpenSimilarities} currentUser={currentUser} selectedUser={selectedUser} />}
		</div>
  );
};

export default SearchUserComponent;