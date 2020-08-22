import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";

import { Helmet } from "react-helmet";
import { Metadata } from "constants/index";
import { gtokFavicon } from "images";
import { SetNewMessagesCount, SetNewAlertsCount, SetSurveysList } from "store/actions";

const HeaderComponent = ({
	currentUser,
	newMessagesCount,
	bindNewMessagesCount,
	newAlertsCount,
	bindNewAlertsCount,
	bindSurveysList
}) => {
	const [metaDetails, setMetaDetails] = useState({});
	useEffect(() => {
		let path = window.location.pathname;
		if (path.includes("/app/chats")) {
			setMetaDetails(Metadata["/app/chats"])
		} else if (path.includes("/app/similarities")) {
			setMetaDetails(Metadata["/app/similarities"])
		} else if (path.includes("/app/profile")) {
			setMetaDetails(Metadata["/app/profile"])
		} else {
			setMetaDetails(Metadata[path || "default"]);
		}
		bindNewMessagesCount(currentUser);
		bindNewAlertsCount(currentUser);
		bindSurveysList(currentUser);
	}, [metaDetails, bindNewMessagesCount, bindNewAlertsCount, bindSurveysList, currentUser]);

  return (
    <div>
    	<Helmet> 
    		<title>{metaDetails.title}</title>
				<meta name="description" content= {metaDetails.description}/>
        <meta name="keywords" content= {metaDetails.keywords} />
        <link rel="icon" type="image/png" href={gtokFavicon} sizes="16x16"/>
      </Helmet>
    	<nav className="navbar fixed-top navbar-expand-sm py-md-0">
    		<div className="navbar-brand mr-auto">
	        <Link to="/app/home">
	        	<img src={gtokFavicon} alt="GTOK" style={{maxHeight: "28px", position: "relative", top: "-7px"}} />
	        	<span className="badge badge-secondary beta-badge">Beta</span>
	        </Link>
				</div>
				<button className="navbar-toggler navbar-toggler-right pull-right" type="button" data-toggle="collapse" data-target=".navbar-collapse" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
			    <span className="navbar-toggler-icon">
			    	<i className="fa fa-bars" style={{verticalAlign: "middle"}}></i>
			    </span>
			  </button>
			  <div className="collapse navbar-collapse">
			  	<ul className="navbar-nav mx-auto">
						<li className="nav-item active" title="Home">
							<div className="nav-link">
				        <Link to="/app/home" className="text-secondary">Home</Link>
				      </div>
			      </li>
						<li className="nav-item active" title="Search">
							<div className="nav-link">
				        <Link to="/app/search" className="text-secondary">Search</Link>
				      </div>
			      </li>
						<li className="nav-item" title="Categories">
							<div className="nav-link">
								<Link to="/app/similarities" className="text-secondary">Categories</Link>
				      </div>
			      </li>
						<li className="nav-item" title="Messages">
							<div className="nav-link">
								<Link to="/app/chats/new/sL8tqx4Gt9yWBEH6cn7G" className="text-secondary">
								Messages{newMessagesCount > 0 && <span className="badge badge-danger count-badge">{newMessagesCount}</span>}
								</Link>
				      </div>
			      </li>
						<li className="nav-item" title="Alerts">
							<div className="nav-link">
				        <Link to="/app/alerts" className="text-secondary">
				        	Alerts{newAlertsCount > 0 && <span className="badge badge-danger count-badge">{newAlertsCount}</span>}
				        </Link>
		      		</div>
		      	</li>
					  { currentUser.admin && (
								<li className="nav-item">
									<div className="nav-link">
										<Link to="/app/graphs">Graphs</Link>
						      </div>
						    </li>
			      	)
			      }
			    {/*
						<li className="nav-item" title="Subscriptions">
							<div className="nav-link">
				        <Link to="/app/payments">Subscriptions</Link>
				      </div>
			      </li>*/}
			  	</ul>
			  	<ul className="navbar-nav ml-auto">
						<li className="nav-item nav-support" title="Help">
							<div className="nav-link">
				        <Link to="/app/support">
				        	<i className="fa fa-question-circle" style={{fontSize: "1.5em"}}></i>
				        </Link>
		      		</div>
		      	</li>
						<li className="nav-item" title="Profile">
							<div className="nav-link">
				        <Link to="/app/profile">
				        	<img src={(currentUser && currentUser.photoURL) || "../logo192.png"} className="navbar-image" alt="Profile pic"/>
				        </Link>
				      </div>
			      </li>
			  	</ul>
		    </div>
    	</nav>
    </div>
  );
};

const mapStateToProps = (state) => {
	const { newMessagesCount } = state.chatMessages;
	const { newAlertsCount } = state.alerts;
	return { newMessagesCount, newAlertsCount };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindNewMessagesCount: (content) => dispatch(SetNewMessagesCount(content)),
		bindNewAlertsCount: (content) => dispatch(SetNewAlertsCount(content)),
		bindSurveysList: (content) => dispatch(SetSurveysList(content))
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(HeaderComponent);