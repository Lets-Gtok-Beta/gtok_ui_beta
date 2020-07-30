import React, { useState, useEffect } from "react";

import { get, update } from "firebase_config";

function PublicProfileComponent({currentUser}) {
	const [ loading, setLoading ] = useState(true);
	const [ permissions, setPermissions ] = useState([]);
	const [ userPms, setUserPms ] = useState(currentUser.permissions || {});

	useEffect(() => {
		async function getPermissions() {
			let pms = await get("permissions");
			setPermissions(pms.sort((a,b) => a.id - b.id));
			setLoading(false);
		}
		getPermissions();
	}, [currentUser]);

	const handleChange = async (key, value) => {
		setLoading(true);
		userPms[key] = !userPms[key];
		await update("users", currentUser.id, {permissions: userPms});
		setUserPms((prevState) =>({...prevState, ...userPms}));
		setLoading(false);
	}

	return (
	  <div className="container">
			<h6 className="text-center">
				<b>Permissions</b> &nbsp;
				{loading &&<i className="fa fa-spinner fa-spin"></i>}
			</h6>
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
		</div>
	);
}

export default PublicProfileComponent;