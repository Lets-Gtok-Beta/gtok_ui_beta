import React, { useState, useContext } from "react";
import {Link, useHistory} from 'react-router-dom';
import { AuthContext } from "App";
import { initFirebaseUser } from 'firebase_config';
import * as firebase from 'firebase';
import { NotificationComponent } from "components";

const DeleteProfileComponent = () => {
  const [email, setEmail] = useState("");
  const [error, setErrors] = useState("");
  const [result, setResult] = useState("");
  const history = useHistory();

  const Auth = useContext(AuthContext);
    
  return (
    <div className="App">
    	<h2>GTOK</h2>
      <h5>Your account is deleted. We hope you come back again.</h5>
      <Link to="/signup">Signup</Link>
    </div>
  );
};

export default DeleteProfileComponent;