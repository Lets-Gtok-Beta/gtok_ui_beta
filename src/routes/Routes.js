import React from "react";
// import { AuthComponent } from "routes";
import { Switch, Route, Redirect } from "react-router-dom";
import AuthRoute from "./index";

import {
	LoginComponent,
	LogoutComponent,
	SignupComponent,
	SignupSuccessComponent,
	AlertsComponent,
	HomeComponent,
	DisplayComponent,
	PublicProfileComponent,
	PrivateProfileComponent,
	GraphsComponent,
	SurveysComponent,
	PaymentsComponent,
	SearchComponent,
	ForgotPasswordComponent,
	DeleteProfileComponent,
	DisplaySurveyComponent,
	ErrorComponent,
	ChatsComponent,
	CreateChatComponent,
	CheckSimilarityComponent,
	SupportComponent
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
		<Route path="/logout" component={LogoutComponent} />
		<Route exact path="/signup" component={SignupComponent} />
		<Route exact path="/signup_success" component={SignupSuccessComponent} />
		<Route exact path="/forgot_password" component={ForgotPasswordComponent} />
		<Route exact path="/profile_deleted" component={DeleteProfileComponent} />
		<Route exact path="/error" component={ErrorComponent} />
		<AuthRoute exact path="/app" component={LandingComponent} />
		<AuthRoute exact path="/app/alerts" component={AlertsComponent} />
		<AuthRoute exact path="/app/home" component={HomeComponent} />
		<AuthRoute exact path="/app/profile" component={PrivateProfileComponent} />
		<AuthRoute exact path="/app/profile/:name" component={PublicProfileComponent} />
		<AuthRoute exact path="/app/graphs" component={GraphsComponent} />
		<AuthRoute exact path="/app/similarities" component={SurveysComponent} />
		<AuthRoute exact path="/app/similarities/:id" component={DisplaySurveyComponent} />
		<AuthRoute exact path="/app/payments" component={PaymentsComponent} />
		<AuthRoute exact path="/app/search" component={SearchComponent} />
		<AuthRoute exact path="/app/search/:id" component={CheckSimilarityComponent} />
		<AuthRoute exact path="/app/question/:id" component={DisplayComponent} />
		<AuthRoute exact path="/app/chats/:id" component={ChatsComponent} />
		<AuthRoute exact path="/app/chats/new/:id" component={CreateChatComponent} />
		<AuthRoute exact path="/app/support" component={SupportComponent} />
	</Switch>
);

export default Routes;