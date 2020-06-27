import React, { useState, useContext, useEffect } from "react";
import { useHistory, Link } from 'react-router-dom';
import { get } from "firebase_config";

const SearchComponent = (props) => {
	const { currentUser } = props;
	const [ users, setUsers ] = useState("");
  const history = useHistory();

  useEffect(() => {
  	async function getUsersList(){
  		let users = await get("users");
  		setUsers(users);
  		console.log("USERS", users);
  	}
  	getUsersList();
  }, []);

  return (
    <div className="container-fluid">
    	<div className="row">
    	{
    		users && users.map((user, idx) => {
    			return (
    			<div className="col-sm-3" key={idx}>
						<div className="card" style={{width: "13rem"}}>
						  <img className="card-img-top" src={user.photoURL || "../logo192.png"} alt="Card image cap" />
						  <div className="card-body">
						    <h5 className="card-title">{user.displayName || "No name"}</h5>
						    <div className="">
							    <button className="btn btn-link btn-sm pl-0">Check similarities</button>
							    <i className="fa fa-plus pull-right"></i>
							  </div>
						  </div>
						</div>
					</div>
					)
    		})
    	}
    	</div>
    </div>
  );
};

export default SearchComponent;