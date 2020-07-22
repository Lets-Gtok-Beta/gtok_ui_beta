import React from "react";
import { StaticHeaderComponent } from "components";

const DeleteProfileComponent = () => {
  const routes = [{route: "/signup", title: "Signup"}, {route: "/login", title: "Login"}];
  return (
    <div className="App">
    	<StaticHeaderComponent routes={routes} />
    	<div className="mt-5 pt-3">
	      <h5>Your account is deleted. We hope you come back.</h5>
	    </div>
    </div>
  );
};

export default DeleteProfileComponent;