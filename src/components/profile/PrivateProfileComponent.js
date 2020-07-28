import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { connect } from "react-redux";

import { NotificationComponent, SurveysComponent } from "components";
import { update, uploadImage, removeImage, signout } from "firebase_config";
import { SetUser, SetLoggedIn, SetDbUser } from "store/actions";
import { capitalizeFirstLetter } from "helpers";

function PrivateProfileComponent({
	user, currentUser, dbUser, bindLoggedIn, bindUser, bindDbUser
}) {
	const defaultImage = "../logo192.png";
	const [name, setName] = useState(dbUser.displayName);
	const [profileUrl, setProfileUrl] = useState(dbUser.photoURL || defaultImage);
	const [btnUpload, setBtnUpload] = useState('Upload');
	const [btnSave, setBtnSave] = useState("");
	// const [btnDelete, setBtnDelete] = useState('Delete Account');
	const [btnSignout, setBtnSignout] = useState('Logout');
	const [result, setResult] = useState({});
  const history = useHistory();
  const pathDetails = {
  	path: "/app/profile",
  	isNewPath: true
  }
  const badges = (dbUser.badges && dbUser.badges.sort((a,b) => a.id - b.id)) || [];

  // Window handlers
	window.jQuery('[data-toggle="popover"]').popover();

  const handleChange = async (key, value) => {
  	if (key === "name") { 
  		setName(value); 
	  	if (dbUser.displayName !== (value && value.trim())) setBtnSave(key);
	  	else setBtnSave("");
  	}
  }

  const saveDetails = async (e) => {
    e.preventDefault();
    if (!name || !name.trim()) {
    	alert("Display name is mandatory");
    	return null;
    }
    let data = {}
    if (name) { data = Object.assign(data, { displayName: name.toLowerCase() })}
    if (profileUrl) {
    	data = Object.assign(data, { photoURL: profileUrl })
    	setBtnUpload("Upload");
    }
    await updateDbUser(data);
    setBtnSave("");
  };

  const updateDbUser = async (data) => {
    /* Update in firestore, instead of firebase auth */
    /* let res = await updateProfile(data); */
    let res = await update("users", dbUser.id, data);
    await bindDbUser({...dbUser, ...data});
  	setResult(res);
  }

  const undoDetails = () => {
  	setName(dbUser.displayName);
  	setProfileUrl(dbUser.photoURL);
  	setBtnSave("");
  }

  const signoutUser = async () => {
  	setBtnSignout("Working...");
  	await signout();
  	await bindLoggedIn(false);
    await bindDbUser(null);
  	await bindUser(null);
  	history.push("/logout");
  }
/*
  const deleteAccount = async (e) => {
  	e.preventDefault();
  	setBtnDelete('Deleting...');
  	await remove('users', dbUser.id)
  	await removeProfile();
		history.push('/profile_deleted');
  }
*/
  const uploadFile = async (file) => {
  	if (!file) {
  		setResult({
  			status: 400,
  			message: 'A new image required'
  		});
  		return null;
  	}
    setBtnSave("image");
  	await uploadImage({
  		file, setBtnUpload, setResult, setProfileUrl
  	});
  }

  const deleteFile = async () => {
  	await removeImage(profileUrl);
  	setProfileUrl(defaultImage);
    await updateDbUser({ photoURL: defaultImage });
  }

  const displayFollowers = async () => {
  	if (!currentUser.premium) {
	  	alert("Please upgrade to see your followers.");
	  	return;
  	}
  }

  const updateElements = () => (
		btnSave && <div className="mt-2">
		<button className="btn btn-sm btn-outline-success" onClick={saveDetails}><i className="fa fa-check"></i></button>
		<button className="btn btn-sm btn-outline-danger ml-2" onClick={undoDetails}><i className="fa fa-times"></i></button>
		</div>
  );

	return (
	  <div className="container-fluid">
	  	{
	  		result.status ? <NotificationComponent result={result} setResult={setResult} /> : ''
	  	}
				<div className="text-center mb-3">
			    <label htmlFor="staticImage">
			    	{
			    		btnUpload === "Upload" ? <img 
								src={profileUrl} 
								alt="dp" 
								className="profilePic"
							/> : <div className="profilePic text-center"><i className="fa fa-spinner fa-spin"></i></div>
			    	}
					</label>
					<span className={`icon-bg-dark ${defaultImage === profileUrl ? 'd-none' : ''}`} onClick={deleteFile} title="Delete image">
						<i className="fa fa-trash"></i>
					</span>
					{btnSave==="image" && updateElements()}
					<br/>
					<button className="mt-3 btn btn-sm btn-danger" onClick={e => displayFollowers(e)}>
						Followers <span className="badge badge-light">{dbUser && dbUser.followers && dbUser.followers.length}</span>
					</button>
			  </div>
				<div>
					<div className="form-group row">
				    <label htmlFor="userName" className="col-sm-2 col-form-label">Name</label>
				    <div className="col-sm-10">
				      <input type="text" className="form-input" id="userName" value={capitalizeFirstLetter(name) || ''} placeholder="Display name" onChange={e => handleChange("name", e.target.value)} />
				      {btnSave==="name" && updateElements()}
				    </div>
				  </div>
					<div className="form-group row">
				    <label htmlFor="dob" className="col-sm-2 col-form-label">Date of birth</label>
				    <div className="col-sm-10">
				    	{dbUser.dob}
				    </div>
				  </div>
					<div className="form-group row">
				    <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Email</label>
				    <div className="col-sm-10">
				    	{dbUser.email} &nbsp; 
			    		<i className={`fa fa-${ user && user.emailVerified ? 'check text-success':'times text-danger'}`}  data-container="body" data-toggle="popover" data-placement="top" data-content={`${user.emailVerified ? "Verified" : "Not verified"}`}></i>
				    </div>
				  </div>
				  { dbUser.admin && 
						<div className="form-group row">
					    <label htmlFor="verified" className="col-sm-2 col-form-label">Admin</label>
					    <div className="col-sm-10">
					    	<i className="fa fa-check"></i>
					    </div>
					  </div>
				  }
					<div className="form-group row">
				    <div className="col-sm-4">
				      <input type="file" className="form-control-plaintext d-none" id="staticImage" onChange={e => uploadFile(e.target.files[0])} accept="image/*" />
				    </div>
				  </div>
					<div className="text-center">
						<h6>
							<b>Badges</b> &nbsp;
							<span className="badge badge-secondary">{badges.length}</span>
						</h6>
						{
							badges[0] ? badges.map((badge, idx) => (
							  <button key={idx} className="btn btn-secondary btn-sm ml-2">{badge.title}</button>
							)) : <b className="text-secondary">No badges achieved yet. Unlock badges by filling surveys.</b>
						}
					</div>
					{ !dbUser.admin &&
					<div>
						<hr/>
						<h4 className="text-center">Surveys</h4>
						<SurveysComponent currentUser={dbUser} redirectTo={pathDetails}/>
					</div> }
					<hr/>
				  <div className="text-center">
					  <button className="btn btn-sm btn-sm-app" disabled={btnSignout !== 'Logout'} onClick={signoutUser}>{btnSignout}</button>
					 </div>
				</div>
			{/*
				<hr/>
				<div className="text-center">
					All your data will be lost, if you delete account. <br/><br/>
					<button type="button" className="btn btn-danger btn-sm-app" onClick={e => deleteAccount(e)} disabled={btnDelete !== 'Delete Account'}>{btnDelete}</button>
				</div>
			*/}
	  </div>
	);
}

const mapStateToProps = (state) => {
	const { dbUser, user } = state.authUsers;
	return { dbUser, user };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindLoggedIn: (content) => dispatch(SetLoggedIn(content)),
		bindUser: (content) => dispatch(SetUser(content)),
		bindDbUser: (content) => dispatch(SetDbUser(content))
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(PrivateProfileComponent);