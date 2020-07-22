import React from "react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";

import { HeaderComponent } from "components";

const DefaultLayout = ({children, dbUser}) => {
  return (
    <div>
    	<HeaderComponent currentUser={dbUser} />
    	<div className="mt-5 mb-5 pt-3">
		  	{children}
    	</div>
    	<Link to="/app/chats/new/sL8tqx4Gt9yWBEH6cn7G">
	    	<div className="chatbot d-flex align-items-center">
	    		<i className="fa fa-envelope"></i>
	    	</div>
	    </Link>
    </div>
  );
};

const mapStateToProps = (state) => {
	const { dbUser } = state.authUsers;
	return { dbUser };
}

export default connect(
	mapStateToProps, 
	null
)(DefaultLayout);