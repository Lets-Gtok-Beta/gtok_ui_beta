import React, { useContext } from "react";
import { Link, useHistory } from 'react-router-dom';
import { connect } from "react-redux";

const DefaultLayout = ({children, dbUser}) => {
  return (
    <div>
    	<nav className="navbar fixed-top navbar-expand-sm">
    		<div className="navbar-brand">
	        <Link to="/app/home">GTOK</Link>
				</div>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
			    <span className="navbar-toggler-icon"></span>
			  </button>
			  <div className="collapse navbar-collapse" id="navbarSupportedContent">
			  	<ul className="navbar-nav mr-auto">
						<li className="nav-item">
							<div className="nav-link">
				        <Link to="/app/search">Search</Link>
				      </div>
			      </li>
						<li className="nav-item">
							<div className="nav-link">
								<Link to="/app/surveys">Surveys</Link>
				      </div>
			      </li>
						<li className="nav-item">
							<div className="nav-link">
								<Link to="/app/graphs">Graphs</Link>
				      </div>
				    </li>
						<li className="nav-item">
							<div className="nav-link">
				        <Link to="/app/payments">Payments</Link>
				      </div>
			      </li>
						<li className="nav-item">
			      </li>
			  	</ul>
					<div className="nav-link">
		        <Link to="/app/alerts">
		        	<i className="fa fa-bell" style={{fontSize: "1.5em"}}></i><span className="badge text-danger">0</span>
		        </Link>
		      </div>
					<div className="nav-link p-0">
		        <Link to="/app/profile">
		        	<img src={dbUser && dbUser.photoURL || "../logo192.png"} className="navbar-image"/>
		        </Link>
		      </div>
		    </div>
    	</nav>
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