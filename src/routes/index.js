import React, { useContext } from "react";
import { Route, withRouter } from "react-router-dom";

import { AuthContext } from "App";
import {
	DefaultLayout,
	ErrorComponent
} from "components";

const AuthSwitchWrapper = ({
	path,
	exact = false,
	truthyComponent: TruthyComponent,
	falsyComponent: FalsyComponent,
	...rest
}) => {
	const Auth = useContext(AuthContext);

	return (
		<Route
			key={path}
			path={path}
			exact={exact}
			render={props => (
					Auth.loggedIn ? (
						<DefaultLayout>
							<TruthyComponent currentUser={Auth.dbUser} {...rest} />
						</DefaultLayout>
					) : (
						<FalsyComponent />
					)
				)
			}
		/>
	);
};

const AuthSwitch = withRouter(AuthSwitchWrapper);

const AuthRoute = ({ component, ...rest }) => (
	<AuthSwitch {...rest} truthyComponent={component} falsyComponent={ErrorComponent} />
);

export default AuthRoute;
