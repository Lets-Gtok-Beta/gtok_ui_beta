import React from "react";
import { Link } from 'react-router-dom';

const ErrorComponent = (props) => (
	<div className="alert alert-info">
		{props.error}
		400 error
		<Link to="/login"> Go Home </Link>
	</div>
);

export default ErrorComponent;