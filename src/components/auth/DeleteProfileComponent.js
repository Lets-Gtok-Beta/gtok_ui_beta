import React from "react";
import {Link} from 'react-router-dom';

const DeleteProfileComponent = () => {
  return (
    <div className="App">
    	<h2>GTOK</h2>
      <h5>Your account is deleted. We hope you come back again.</h5>
      <Link to="/signup">Signup</Link>
    </div>
  );
};

export default DeleteProfileComponent;