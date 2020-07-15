import React from "react";
import { Link } from 'react-router-dom';

const AlertsComponent = (props) => {
  return (
    <div>
      <h1>AlertsComponent</h1>
      {console.log(props)}
      <Link to="/app/profile">Profile</Link>
    </div>
  );
};

export default AlertsComponent;