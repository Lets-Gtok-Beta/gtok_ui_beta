import React, { useState } from "react";
import {Link, useHistory} from 'react-router-dom';
import * as firebase from 'firebase';
import { NotificationComponent } from "components";

const ForgotPasswordComponent = () => {
  const [email, setEmail] = useState("");
	const [btnSave, setBtnSave] = useState("Send");
  const [result, setResult] = useState("");
  const history = useHistory();

  const handleForm = e => {
    e.preventDefault();
    setBtnSave("Sending...");
    firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(res => {
    	console.log('res', res)
    	setResult({
    		status: 200,
    		message: 'Email sent'
    	});
    	setTimeout(() => {
    		history.push('/login');
    	}, 3000);
    })
    .catch(e => {
    	setResult({
    		status: 404,
    		message: e.message
    	});
    });
  };
    
  return (
    <div className="App">
      <h2>Forgot password</h2>
	  	{
	  		result.status ? <NotificationComponent result={result} setResult={setResult} /> : ''
	  	}
      <div className="form">
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          name="email"
          type="email"
          className="form-input"
          placeholder="Enter email"
        />
        <br />
			  <div className="text-center">
				  <button className="btn btn-sm-app" disabled={btnSave !== 'Send'} onClick={e => handleForm(e)}>{btnSave}</button>
				 </div>
      </div>
      <br/>
    {/*
      <button onClick={() => signInWithGoogle()} className="googleBtn" type="button">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          alt="logo"
        />
        Login With Google
      </button>
    */}
      New user? <Link to="/signup">Sign up</Link> <br/>
      Existing user? <Link to="/login">Login</Link>
    </div>
  );
};

export default ForgotPasswordComponent;