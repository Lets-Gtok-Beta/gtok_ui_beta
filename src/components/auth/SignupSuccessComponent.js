import React from "react";
import { StaticHeaderComponent } from "components";

const routes = [{route: "/login", title: "Login"}];
const SignupSuccessComponent = () => (
  <div className="App">
  	<StaticHeaderComponent routes={routes} />
  	<div className="mt-5 pt-3">
  		<h3 className="text-success"><i className="fa fa-check-circle fa-2x"></i></h3>
      <h5>Succesfully signed up. Kindly verify your email.</h5>
      <a href="/login">Login</a>
    </div>
  </div>
);

export default SignupSuccessComponent;