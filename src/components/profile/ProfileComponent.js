import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import { NotificationComponent } from "components";
import { update, removeProfile, uploadImage, removeImage, remove, signout } from "firebase_config";
import { SetUser, SetLoggedIn, SetDbUser } from "store/actions";

function ProfileComponent({
	user, currentUser, dbUser, bindLoggedIn, bindUser, bindDbUser
}) {
	const defaultImage = "../logo192.png";
	const [name, setName] = useState(dbUser.displayName);
	const [profileUrl, setProfileUrl] = useState(dbUser.photoURL || defaultImage);
	const [file, setFile] = useState('');
	const [btnUpload, setBtnUpload] = useState('Upload');
	const [btnSave, setBtnSave] = useState('Save');
	const [btnDelete, setBtnDelete] = useState('Delete Account');
	const [btnSignout, setBtnSignout] = useState('Logout');
	const [result, setResult] = useState({});
  const history = useHistory();

  const handleForm = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
    	alert("Display name is mandatory");
    	return null;
    }
    setBtnSave('Saving...');
    let data = {}
    if (name) { data = Object.assign(data, { displayName: name })}
    if (profileUrl) {
    	data = Object.assign(data, { photoURL: profileUrl })
    	setBtnUpload("Upload");
    	setFile("");
    }

    /* Update in firestore, instead of firebase auth */
    /* let res = await updateProfile(data); */
    let res = await update("users", dbUser.id, data);
    await bindDbUser({...dbUser, ...data});
    setBtnSave("Save");
  	setResult(res);
  };

  const signoutUser = async () => {
  	setBtnSignout("Working...");
  	await signout();
  	await bindLoggedIn(false);
    await bindDbUser(null);
  	await bindUser(null);
  	history.push("/logout");
  }

  const deleteAccount = async (e) => {
  	e.preventDefault();
  	setBtnDelete('Deleting...');
  	await remove('users', dbUser.id)
  	await removeProfile();
		history.push('/profile_deleted');
  }

  const uploadFile = async () => {
  	if (!file) {
  		setResult({
  			status: 400,
  			message: 'A new image required'
  		});
  		return null;
  	}
  	await uploadImage({
  		file, setBtnUpload, setResult, setProfileUrl
  	});
  }

  const deleteFile = async () => {
  	await removeImage(profileUrl);
  	setProfileUrl(defaultImage);
    
    let res = await update('users', dbUser.id, {photoURL: defaultImage});
  	setResult(res);
  }

  const displayFollowers = async () => {
  	if (!currentUser.premium) {
	  	alert("Please upgrade to see your followers.");
	  	return;
  	}
  }

	return (
	  <div className="container-fluid">
	  	{
	  		result.status ? <NotificationComponent result={result} setResult={setResult} /> : ''
	  	}
				<div className="text-center mb-3">
					<img 
						src={profileUrl} 
						alt="dp" 
						className="profilePic"
					/>
					<span className={`icon-bg-dark ${defaultImage === profileUrl ? 'd-none' : ''}`} onClick={deleteFile} title="Delete image">
						<i className="fa fa-trash"></i>
					</span>
					<br/>
					<button className="mt-3 btn btn-sm btn-danger" onClick={e => displayFollowers(e)}>
						Followers <span className="badge badge-light">{dbUser && dbUser.followers && dbUser.followers.length}</span>
					</button>
			  </div>
				<div>
					<div className="form-group row">
				    <label htmlFor="userName" className="col-sm-2 col-form-label">Name</label>
				    <div className="col-sm-10">
				      <input type="text" className="form-input" id="userName" value={name || ''} placeholder="Display name" onChange={e => setName(e.target.value)} />
				    </div>
				  </div>
					<div className="form-group row">
				    <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Email</label>
				    <div className="col-sm-10">
				    	{dbUser.email}
				    </div>
				  </div>
					<div className="form-group row">
				    <label htmlFor="verified" className="col-sm-2 col-form-label">Verified</label>
				    <div className="col-sm-10">
				    	<i className={`fa fa-${ user && user.emailVerified ? 'check':'times'}`}></i>
				    </div>
				  </div>
					<div className="form-group row">
				    <label htmlFor="verified" className="col-sm-2 col-form-label">Admin</label>
				    <div className="col-sm-10">
				    	<i className={`fa fa-${dbUser.admin ? 'check':'times'}`}></i>
				    </div>
				  </div>
					<div className="form-group row">
				    <label htmlFor="premium" className="col-sm-2 col-form-label">Premium</label>
				    <div className="col-sm-10">
				    	<i className={`fa fa-${dbUser.premium ? 'check':'times'}`}></i>
				    </div>
				  </div>
					<div className="form-group row">
				    <label htmlFor="staticImage" className="col-sm-2 col-form-label">Update DP</label>
				    <div className="col-sm-4">
				      <input type="file" className="form-control-plaintext" id="staticImage" onChange={e => setFile(e.target.files[0])}/>
				    </div>
				    <div className="col-sm-6">
				  		<button className="btn btn-sm btn-danger" onClick={uploadFile} disabled={!file}>
				  				{btnUpload}
				  		</button>
				    </div>
				  </div>
				  <div className="text-center">
					  <button className="btn btn-sm btn-sm-app" disabled={btnSave !== 'Save'} onClick={e => handleForm(e)}>{btnSave}</button>
					 </div>
					<br/>
				  <div className="text-center">
					  <button className="btn btn-sm btn-sm-app" disabled={btnSignout !== 'Logout'} onClick={signoutUser}>{btnSignout}</button>
					 </div>
				</div>
				<hr/>
				<div className="text-center">
					All your data will be lost, if you delete account. <br/><br/>
					<button type="button" className="btn btn-danger btn-sm-app" onClick={e => deleteAccount(e)} disabled={btnDelete !== 'Delete Account'}>{btnDelete}</button>
				</div>
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
)(ProfileComponent);