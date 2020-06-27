import React, { useState, useContext } from "react";
import { useHistory, Link } from 'react-router-dom';

const PaymentsComponent = (props) => {
  const history = useHistory();

  return (
    <div>
      <h1>PaymentsComponent</h1>
      {console.log(props)}
      <Link to="/app/profile">Profile</Link>
    </div>
  );
};

export default PaymentsComponent;