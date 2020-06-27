import React, { useState, useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import { AuthContext } from "App";
import { NotificationComponent } from "components";
import { update, removeProfile, uploadImage, removeImage, remove, signout, getQuery, firestore } from "firebase_config";

function ProfileComponent(props) {
	const Auth = useContext(AuthContext);
	const defaultImage = "../logo192.png";
	const { currentUser } = props;
	const [user, setUser] = useState(props.currentUser);
	const [name, setName] = useState(user.displayName);
	const [profileUrl, setProfileUrl] = useState(user.photoURL || defaultImage);
	const [file, setFile] = useState('');
	const [fileInput, setFileInput] = useState('');
	const [btnUpload, setBtnUpload] = useState('Upload');
	const [btnSave, setBtnSave] = useState('Save');
	const [btnDelete, setBtnDelete] = useState('Delete Account');
	const [btnSignout, setBtnSignout] = useState('Logout');
	const [result, setResult] = useState({});
  const history = useHistory();

  useEffect(() => {
		async function getUser() {
			let res = await getQuery(firestore.collection('users').where("email", "==", currentUser.email).get());
			setUser(res[0]);
			setName(res[0].displayName);
		}
		getUser();
  }, [result.status]);

  const handleForm = async (e) => {
    e.preventDefault();
    setBtnSave('Saving...');

    let data = {}
    if (name) { data = Object.assign(data, { displayName: name })}
    if (profileUrl) {
    	data = Object.assign(data, { photoURL: profileUrl })
    	setBtnUpload('Upload');
    	setFileInput('');
    	setFile('');
    }

    /* Update in firestore, instead of firebase auth */
    /* let res = await updateProfile(data); */
    let res = await update('users', user.id, data);
    setBtnSave('Save');
  	setResult(res);
  	/* To update in Auth */
    Auth.setDbUser({...data, ...user});
  };

  const signoutUser = async () => {
  	await signout(Auth);
  	history.push("/login");
  }

  const deleteAccount = async (e) => {
  	e.preventDefault();
  	setBtnDelete('Deleting...');
  	await remove('users', user.id)
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
    
    let res = await update('users', user.id, {photoURL: null});
  	setResult(res);
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
					<span className={`icon-bg-dark ${defaultImage == profileUrl ? 'd-none' : ''}`} onClick={deleteFile} title="Delete image">
						<i className="fa fa-trash"></i>
					</span>
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
				    	{user.email}
				    </div>
				  </div>
					<div className="form-group row">
				    <label htmlFor="verified" className="col-sm-2 col-form-label">Verified</label>
				    <div className="col-sm-10">
				    	<i className={`fa fa-${Auth.user.emailVerified ? 'check':'times'}`}></i>
				    </div>
				  </div>
					<div className="form-group row">
				    <label htmlFor="verified" className="col-sm-2 col-form-label">Admin</label>
				    <div className="col-sm-10">
				    	<i className={`fa fa-${user.admin ? 'check':'times'}`}></i>
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

export default ProfileComponent;