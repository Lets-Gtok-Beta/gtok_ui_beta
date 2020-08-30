import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { add, update, timestamp } from "firebase_config";
import { SetPermissions } from "store/actions";

function PublicProfileComponent({currentUser, pms, bindPermissions}) {
	const [ loading, setLoading ] = useState(true);
	const [ userPms, setUserPms ] = useState(currentUser.permissions || {});

	useEffect(() => {
		if (!pms[0]) bindPermissions(currentUser);
		setLoading(false);
	}, [currentUser, pms, bindPermissions]);

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
	  		pms.map((pm, idx) => (
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

const mapStateToProps = (state) => {
	const { pms } = state.permissions;
	return { pms };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindPermissions: (content) => dispatch(SetPermissions(content))
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(PublicProfileComponent);