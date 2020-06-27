import React from "react";
// import { AuthComponent } from "routes";
import { Switch, BrowserRouter as Router, Route, useHistory, Redirect } from "react-router-dom";
import AuthRoute from "./index";

import {
	LoginComponent,
	SignupComponent,
	HomeComponent,
	DisplayComponent,
	ProfileComponent,
	GraphsComponent,
	SurveysComponent,
	PaymentsComponent,
	SearchComponent,
	ForgotPasswordComponent,
	DeleteProfileComponent,
	DisplaySurveyComponent,
	ErrorComponent
} from "components";

const LandingComponent = () => {
	let token = window.sessionStorage.getItem('token');
	if (!token) {
		return (<Redirect to="/login" />)
	}
	return (<Redirect to="/app/profile" />);
};

export const Routes = (props) => (
	<Switch>
		<Route exact path="/" component={LandingComponent} />
		<Route path="/login" component={LoginComponent} />
		<Route exact path="/signup" component={SignupComponent} />
		<Route exact path="/forgot_password" component={ForgotPasswordComponent} />
		<Route exact path="/profile_deleted" component={DeleteProfileComponent} />
		<Route exact path="/error" component={ErrorComponent} />
		<AuthRoute exact path="/app" component={LandingComponent} />
		<AuthRoute exact path="/app/home" component={HomeComponent} />
		<AuthRoute exact path="/app/profile" component={ProfileComponent} />
		<AuthRoute exact path="/app/graphs" component={GraphsComponent} />
		<AuthRoute exact path="/app/surveys" component={SurveysComponent} />
		<AuthRoute exact path="/app/surveys/:id" component={DisplaySurveyComponent} />
		<AuthRoute exact path="/app/payments" component={PaymentsComponent} />
		<AuthRoute exact path="/app/search" component={SearchComponent} />
		<AuthRoute exact path="/app/question/:id" component={DisplayComponent} />
	</Switch>
);

export default Routes;