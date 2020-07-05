import React, { useState, useContext } from "react";
import { useHistory, Link } from 'react-router-dom';

const AlertsComponent = (props) => {
  const history = useHistory();

  return (
    <div>
      <h1>AlertsComponent</h1>
      {console.log(props)}
      <Link to="/app/profile">Profile</Link>
    </div>
  );
};

export default AlertsComponent;