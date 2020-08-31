import React, { useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import { connect } from "react-redux";

import { signin } from 'firebase_config';
import { SetReload } from "store/actions";
import { StaticHeaderComponent } from "components";

const LoginComponent = ({bindReload}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
	const [btnSave, setBtnSave] = useState("Submit");
  const [error, setErrors] = useState("");
  const history = useHistory();
  const routes = [];

	const handleKeyDown =(event) => {
		if (event.keyCode === 13) {
			handleForm(event);
		}
	}

  const handleForm = async (e) => {
    e.preventDefault();

    setBtnSave("Submitting...");
    let result = await signin({email, password});
    setBtnSave("Submit");
    if (result.status !== 200) {
    	setErrors(result.message);
    	return;
    } 
    bindReload(true);
  	history.push("/app/home");
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
    <div className="App" onKeyDown={e => handleKeyDown(e)}>
    	<StaticHeaderComponent routes={routes} />
    	<div className="row">
	    	<div className="mt-5 pt-3 col-xs-12 col-md-6">
		      <h4>Login</h4>
		      {error ? <div className="alert alert-danger">{error}</div> : ''}
		      <div className="form">
		        <input
		          value={email}
		          onChange={e => setEmail(e.target.value)}
		          name="email"
		          type="email"
		          className="form-input"
		          placeholder="Enter email"
		          autoFocus={true}
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
						  <button className="btn btn-secondary btn-sm" disabled={btnSave !== 'Submit'} onClick={e => handleForm(e)}>{btnSave}</button>
						</div>
						<br/>
		        <Link to="/forgot_password">Forgot password</Link>
		        <Link to="/signup">New User? Signup</Link>
		      </div>
		    </div>
		    <div className="mt-5 pt-3 col-xs-12 col-md-6 login-page-clipart">
		    	<img src="assets/images/two_people_1_2.jpg" alt="Lets Gtok" className="col-8" />
		    	<div className="login-page-caption">Lets <span className="text-danger">Get To Know </span>each other <br/> & bring similarities together.

		    	</div>
		    </div>
		  </div>
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