import React, { useState, useEffect } from "react";

import { add, update, getQuery, firestore, timestamp } from "firebase_config";

function PublicProfileComponent({currentUser}) {
	const [ loading, setLoading ] = useState(true);
	const [ permissions, setPermissions ] = useState([]);
	const [ userPms, setUserPms ] = useState(currentUser.permissions || {});

	useEffect(() => {
		async function getPermissions() {
			let pms = await getQuery(
				firestore.collection("permissions").where("active", "==", true).get()
			);
			setPermissions(pms.sort((a,b) => a.id - b.id));
			setLoading(false);
		}
		getPermissions();
	}, [currentUser]);

	const handleChange = async (key, value) => {
		setLoading(true);
		userPms[key] = !userPms[key];
		await update("users", currentUser.id, {permissions: userPms});
		/* Log the activity */
  	await add("logs", {
  		text: `${currentUser.displayName} updated permissions`,
  		photoURL: currentUser.photoURL,
  		receiverId: "",
  		userId: currentUser.id,
  		actionType: "update",
  		collection: "users",
  		actionId: currentUser.id,
  		actionKey: "permissions",
  		description: userPms,
  		timestamp
  	});
		setUserPms((prevState) =>({...prevState, ...userPms}));
		setLoading(false);
	}

	return (
	  <div className="container">
			{
	  		permissions.map((pm, idx) => (
					<div className="d-flex align-content-center" key={idx}>
						<div className="custom-switch mb-2">
						  <input type="checkbox" className="custom-control-input" id={pm.name} name={pm.name} onChange={e => handleChange(pm.name, e.target.value)} checked={userPms[pm.name]} />
						  <label className="custom-control-label ml-2" htmlFor={pm.name}>
						  	{pm.description}
						  </label>
						</div>
					</div>
	  		))
  		}
  		<div className="text-center">
				{loading &&<i className="fa fa-spinner fa-spin"></i>}
			</div>
		</div>
	);
}

export default PublicProfileComponent;