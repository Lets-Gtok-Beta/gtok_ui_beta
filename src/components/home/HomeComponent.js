import React from "react";
import { Link } from 'react-router-dom';

const HomeComponent = (props) => {
  return (
    <div>
      <h1>HomeComponent</h1>
      {console.log(props)}
      <Link to="/app/profile">Profile</Link>
    </div>
  );
};

export default HomeComponent;