import React, { useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import moment from "moment";

import { signup, add } from "firebase_config";
import { StaticHeaderComponent } from "components";
import { validateEmail } from "helpers";

const SignupComponent = () => {
  const [ name, setName ] = useState("");
  const [ dob, setDob ] = useState("");
  const [ dateType, setDateType ] = useState("text");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ cpassword, setCpassword ] = useState("");
  // const [tnc, setTnc] = useState(false);
  const [ emailUpdates, setEmailUpdates ] = useState(true);
	const [ btnSave, setBtnSave ] = useState("Submit");
  const [ error, setErrors ] = useState("");
  const history = useHistory();

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
    if (dob && (moment().diff(dob, 'years', false) < 18)) {
    	setErrors("You must be 18 years old to proceed");
    	return;
    }
    if (!email || !email.trim()) {
    	setErrors("Please enter your email");
    	return;
    }
    if (email && !validateEmail(email)) {
    	setErrors("Please enter a valid email");
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
    // if (!tnc) {
    // 	setErrors("Agree to our Terms and conditions");
    // 	return;
    // }
    let data = {
    	name: name.toLowerCase(),
    	dob,
    	emailUpdates
    }
    setBtnSave("Submitting...");
    await signup({email, password, data});
    let userData = {
  		email,
  		followers: [],
  		displayName: name.toLowerCase(),
  		dob,
  		permissions: {
  			tnc: true,
  			recordPageVisits: true,
  			locationAccess: true,
  			emailUpdates
  		},
  		photoURL: null,
  		verifyEmailSentTime: new Date()
    }
    let createDbUser = await add("users", userData);
    setBtnSave("Submit");
    if (createDbUser.status !== 200) {
    	setErrors(createDbUser.message);
    	return;
    }
  	history.push("/");
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
    	<StaticHeaderComponent />
    	<div className="mt-5 pt-3">
		    <h4>Signup</h4>
		    <div className="text-secondary">Lets Gtok is in Beta stage. As a Beta app user, you can use our app with limited features.</div>
      {error ? <div className="alert alert-danger">{error}</div> : ''}
	      <div className="form pt-4">
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
	          onFocus={e => setDateType("date")}
	          onBlur={e => setDateType("text")}
	          name="dob"
	          value={dob}
	          type={dateType}
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
	      {/*
					<div className="d-flex">
						<div className="custom-switch mb-2">
						  <input type="checkbox" className="custom-control-input" id="tnc" name="tnc" onChange={e => setTnc(!tnc)} checked={tnc} />
						  <label className="custom-control-label text-left" htmlFor="tnc">
						  	<small>Agree to our Terms and Conditions.</small>
						  </label>
						</div>
					</div>
				*/}
					<div className="d-flex">
						<div className="custom-switch mb-2">
						  <input type="checkbox" className="custom-control-input" id="emailUpdates" name="emailUpdates" onChange={e => setEmailUpdates(!emailUpdates)} checked={emailUpdates} />
						  <label className="custom-control-label" htmlFor="emailUpdates">
						  	<small>Would like to get email notifications.</small>
						  </label>
						</div>
					</div>
				  <div className="text-center">
					  <button className="btn btn-secondary btn-sm" disabled={btnSave !== 'Submit'} onClick={e => handleForm(e)}>{btnSave}</button>
				  </div>
					<br/>
	        <Link to="/login">Existing User? Login</Link>
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
