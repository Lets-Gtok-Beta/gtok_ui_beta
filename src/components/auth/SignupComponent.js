import React, { useState } from "react";
import {Link, useHistory} from "react-router-dom";
import { signup } from "firebase_config";

const SignupComponent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
	const [btnSave, setBtnSave] = useState("Signup");
  const [error, setErrors] = useState("");
  const history = useHistory();

  const handleForm = async (e) => {
    e.preventDefault();
    if (!name || !name.trim()) {
    	setErrors("Please enter your name");
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
    setBtnSave("Working...");
    let result = await signup({email, password, name});
    setBtnSave("Signup");
    if (result.status !== 200) {
    	setErrors(result.message);
    	return;
    } 
  	history.push("/login");
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
      <h2>New user</h2>
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
			  <div className="text-center">
				  <button className="btn btn-sm btn-sm-app" disabled={btnSave !== 'Signup'} onClick={e => handleForm(e)}>{btnSave}</button>
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
      Already a user? <Link to="/login">Sign in</Link> here
    </div>
  );
};

export default SignupComponent;