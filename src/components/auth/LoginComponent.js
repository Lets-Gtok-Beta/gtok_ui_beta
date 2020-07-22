import React, { useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import { connect } from "react-redux";

import { signin } from 'firebase_config';
import { SetReload } from "store/actions";
import { StaticHeaderComponent } from "components";

const LoginComponent = ({bindReload}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
	const [btnSave, setBtnSave] = useState("Login");
  const [error, setErrors] = useState("");
  const history = useHistory();
  const routes = [{route: "/signup", title: "Signup"}];

  const handleForm = async (e) => {
    e.preventDefault();

    setBtnSave("Working...");
    let result = await signin({email, password});
    setBtnSave("Login");
    if (result.status !== 200) {
    	setErrors(result.message);
    	return;
    } 
    bindReload(true);
  	history.push("/app/profile");
  };

/*
 	const signInWithGoogle = async () => {
	  let result = await googleSignin();
	  if (result.status !== 200) {
	  	setErrors(result.message);
	  	return;
	  } 
	  bindReload(true);
		history.push("/app/home");
	}
*/
  return (
    <div className="App">
    	<StaticHeaderComponent routes={routes} />
    	<div className="mt-5 pt-3">
	      <h4>Already a user?</h4>
	      {error ? <div className="alert alert-danger">{error}</div> : ''}
	      <div className="form">
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
	          placeholder="Enter password"
	        />
	        <br />
				  <div className="text-center">
					  <button className="btn btn-sm btn-sm-app" disabled={btnSave !== 'Login'} onClick={e => handleForm(e)}>{btnSave}</button>
					</div>
					<br/>
	        <Link to="/forgot_password">Forgot password</Link>
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
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
	return {
		bindReload: (content) => dispatch(SetReload(content))
	}
}

export default connect(
	null, 
	mapDispatchToProps
)(LoginComponent);