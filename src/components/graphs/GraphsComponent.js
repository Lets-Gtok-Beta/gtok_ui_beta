import React, { useState, useContext } from "react";
import { useHistory, Link } from 'react-router-dom';

const GraphsComponent = (props) => {
  const history = useHistory();

  return (
    <div>
      <h1>GraphsComponent</h1>
      {console.log(props)}
      <Link to="/app/profile">Profile</Link>
    </div>
  );
};

export default GraphsComponent;