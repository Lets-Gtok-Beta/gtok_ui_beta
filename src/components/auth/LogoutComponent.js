import React from "react";
import { StaticHeaderComponent } from "components";

const routes = [{route: "/signup", title: "Signup"}, {route: "/login", title: "Login"}];
const LogoutComponent = () => (
  <div className="App">
  	<StaticHeaderComponent routes={routes} />
  	<div className="mt-5 pt-3">
      <h5>Succesfully logged out from GTOK.</h5>
      <a href="/login">Login</a>
    </div>
  </div>
);

export default LogoutComponent;