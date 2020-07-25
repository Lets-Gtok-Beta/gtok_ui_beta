import React, { useState, useEffect } from "react";
import { get, getQuery, firestore } from "firebase_config";
import { SearchUserComponent } from "components";

const SearchComponent = (props) => {
	const { currentUser } = props;
	const [ users, setUsers ] = useState("");

  useEffect(() => {
  	async function getUsersList() {
  		let users = await get("users");
  		users = users.filter(u => u.id !== currentUser.id);
  		setUsers(users);
  	}
  	async function getAdminUsers() {
			let users = await getQuery(
				firestore.collection("users").where("admin", "==", true).get()
			);
  		users = users.filter(u => u.id !== currentUser.id);
  		setUsers(users);
  	}
		if (currentUser.admin) { getAdminUsers(); }
		else { getUsersList(); }
  }, [currentUser]);

/*
  const isFollower = async (user) => {
  	return user.followers && user.followers.find(u => u.id === currentUser.id);
  }

  const followUser = async (user) => {
  	let followers = user.followers || [];
  	followers.push(currentUser.id);
  	await update("users", user.id, { followers });
  	alert("Successfully followed!");
  }

  const unFollowUser = async (user) => {
  	let followers = user.followers || [];
  	followers = followers.filter(u => u.id != currentUser.id);
  	await update("users", user.id, { followers });
  	alert("Unfollowed successfully!");
  }
*/
  return (
    <div className="container-fluid">
    	<div className="row">
    	{
    		users && users.map((user, idx) => 
  				<SearchUserComponent displayUser={user} currentUser={currentUser} key={idx} />)
    	}
    	</div>
    </div>
  );
};

export default SearchComponent;