import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
	DefaultLayout,
	ErrorComponent
} from "components";
import { SetReload } from "store/actions";

const AuthSwitchWrapper = (props) => {
	const {	
		path,
		exact = false,
		truthyComponent: TruthyComponent,
		falsyComponent: FalsyComponent,
		loggedIn,
		dbUser,
		reload,
		bindReload,
		...rest
	} = props;

	let localReload = reload;

	useEffect(() => {
		bindReload(false);
	}, [reload, bindReload]);

	if (!navigator.onLine) {
		return (<Redirect to="/error" />)
	}

	if (localReload) {
		window.location.reload();
	}

	return (
		<Route
			key={path}
			path={path}
			exact={exact}
			render={props => (
					loggedIn ? (
						<DefaultLayout>
							<TruthyComponent currentUser={dbUser} {...rest} />
						</DefaultLayout>
					) : (
						<FalsyComponent />
					)
				)
			}
		/>
	);
};

const mapStateToProps = (state) => {
	const { loggedIn, dbUser, reload } = state.authUsers;
	return { loggedIn, dbUser, reload };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindReload: (content) => dispatch(SetReload(content))
	}
}

const AuthSwitch = connect(
	mapStateToProps, 
	mapDispatchToProps
)(AuthSwitchWrapper);

// const AuthSwitch = connect(
// 	mapStateToProps, 
// 	mapDispatchToProps
// )(AuthSwitchWrapper);

const AuthRoute = ({ component, ...rest }) => (
	<AuthSwitch {...rest} truthyComponent={component} falsyComponent={ErrorComponent} />
);

export default AuthRoute;
