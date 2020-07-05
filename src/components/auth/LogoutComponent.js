import React from "react";
import {Link} from 'react-router-dom';

const LogoutComponent = () => {
  return (
    <div className="App">
    	<h2>GTOK</h2>
      <h5>Succesfully logged out.</h5>
      <a href="/login">Login</a>
    </div>
  );
};

export default LogoutComponent;