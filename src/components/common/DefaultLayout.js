import React from "react";
import { connect } from "react-redux";

import { HeaderComponent } from "components";

const DefaultLayout = ({children, dbUser}) => {
  return (
    <div>
    	<HeaderComponent currentUser={dbUser} />
    	<div className="mt-5 mb-5 pt-3">
		  	{children}
    	</div>
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