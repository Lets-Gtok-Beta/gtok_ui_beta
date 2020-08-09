import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { signup, add } from "firebase_config";
import { StaticHeaderComponent } from "components";

const SignupComponent = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [tnc, setTnc] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
	const [btnSave, setBtnSave] = useState("Signup");
  const [error, setErrors] = useState("");
  const history = useHistory();
  const routes = [{route: "/login", title: "Login"}];

  const handleForm = async (e) => {
    e.preventDefault();
    if (!name || !name.trim()) {
    	setErrors("Please enter your name");
    	return;
    }
    if (!dob) {
    	setErrors("Please enter your Date of birth");
    	return;
    }
    if (!email || !email.trim()) {
    	setErrors("Please enter your email");
    	return;
    }
    if (!password || !password.trim()) {
    	setErrors("Please enter a password");
    	return;
    }
    if (!cpassword || !cpassword.trim()) {
    	setErrors("Please re-enter password");
    	return;
    }
    if (password !== cpassword) {
    	setErrors("Password & confirm password must be same");
    	return;
    }
    if (!tnc) {
    	setErrors("Agree to our Terms and conditions");
    	return;
    }
    let data = {
    	name: name.toLowerCase(),
    	dob,
    	tnc,
    	emailUpdates
    }
    setBtnSave("Working...");
    let createAuthUser = await signup({email, password, data});
    if (createAuthUser.status !== 200) {
    	setErrors(createAuthUser.message);
    	return;
    }    
    let userData = {
  		email,
  		followers: [],
  		displayName: name.toLowerCase(),
  		dob,
  		permissions: {
  			tnc,
  			emailUpdates
  		}
    }
    let createDbUser = await add("users", userData);
    setBtnSave("Signup");
    if (createDbUser.status !== 200) {
    	setErrors(createDbUser.message);
    	return;
    }
  	history.push("/signup_success");
  };

	/*
  const handleGoogleLogin = async () => {
    let result = await googleSignup();
    if (result.status !== 200) {
    	setErrors(result.message);
    	return;
    } 
    Auth.setLoggedIn(true)
  	history.push("/app/home");
  }*/

  return (
    <div className="App">
    	<StaticHeaderComponent routes={routes} />
    	<div className="mt-5 pt-3">
		    <h4>New user</h4>
      {error ? <div className="alert alert-danger">{error}</div> : ''}
	      <div className="form">
	        <input
	          value={name}
	          onChange={e => setName(e.target.value)}
	          name="name"
	          type="text"
	          className="form-input"
	          placeholder="Enter your name"
	        />
	        <input
	          onChange={e => setDob(e.target.value)}
	          name="dob"
	          value={dob}
	          type="date"
	          className="form-input"
	          placeholder="Date of birth"
	          max="2003-01-01"
	        />
	        <input
	          value={email}
	          onChange={e => setEmail(e.target.value)}
	          name="email"
	          type="email"
	          className="form-input"
	          placeholder="Enter email"
	        />
	        <input
	          onChange={e => setPassword(e.target.value)}
	          name="password"
	          value={password}
	          type="password"
	          className="form-input"
	          placeholder="Enter password (must be atleast 6 letters)"
	        />
	        <input
	          onChange={e => setCpassword(e.target.value)}
	          name="cpassword"
	          value={cpassword}
	          type="password"
	          className="form-input"
	          placeholder="Re-enter password"
	        />
	        <br/>
					<div className="d-flex">
						<div className="custom-switch mb-2">
						  <input type="checkbox" className="custom-control-input" id="tnc" name="tnc" onChange={e => setTnc(!tnc)} checked={tnc} />
						  <label className="custom-control-label text-left" htmlFor="tnc">
						  	<small>Agree to our Terms and Conditions.</small>
						  </label>
						</div>
					</div>
					<div className="d-flex">
						<div className="custom-switch mb-2">
						  <input type="checkbox" className="custom-control-input" id="emailUpdates" name="emailUpdates" onChange={e => setEmailUpdates(!emailUpdates)} checked={emailUpdates} />
						  <label className="custom-control-label" htmlFor="emailUpdates">
						  	<small>Would like to get email notifications.</small>
						  </label>
						</div>
					</div>	        
				  <div className="text-center">
					  <button className="btn btn-sm btn-sm-app" disabled={btnSave !== 'Signup'} onClick={e => handleForm(e)}>{btnSave}</button>
				  </div>
	      </div>
	    </div>
    <br/>
    {/*
      <button onClick={() => handleGoogleLogin()} class="googleBtn" type="button">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          alt="logo"
        />
        Join With Google
      </button>
    */}
    </div>
  );
};

export default SignupComponent;