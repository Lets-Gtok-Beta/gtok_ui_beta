import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";

import { Helmet } from "react-helmet";
import { Metadata } from "constants/index";
import { gtokFavicon } from "images";
import { SetNewMessagesCount, SetNewAlertsCount, SetSurveysList } from "store/actions";

const BottomHeaderComponent = ({
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
		  	<ul className="navbar-nav ml-auto">
					<li className="nav-item" title="Profile">
						<div className="nav-link p-0">
							{/*
				        <Link to="/app/profile">
				        	<img src={(currentUser && currentUser.photoURL) || gtokFavicon} className="navbar-image" alt="Profile pic"/>
				        </Link>
							*/}
			        <Link to="/app/support" className="text-secondary">
			        	Help
			        </Link>
			      </div>
		      </li>
	      </ul>
    	</nav>
    	<div className="d-flex flex-row navbar-bottom align-items-center align-self-center justify-content-around">
				<div className={`nav-item ml-1 ${(metaDetails.path === "home") && "nav-item-active"}`} title="Home">
					<div className="nav-link text-center">
		        <Link to="/app/home">
		        	<i className="fa fa-home"></i><br/>
			        Home
		        </Link>
		      </div>
	      </div>
				<div className={`nav-item ${(metaDetails.path === "search") && "nav-item-active"}`} title="Search">
					<div className="nav-link text-center">
		        <Link to="/app/search">
		        	<i className="fa fa-search"></i><br/>
			        Search
		        </Link>
		      </div>
	      </div>
				<div className={`nav-item ${(metaDetails.path === "chats") && "nav-item-active"}`} title="Messages">
					<div className="nav-link text-center">
						<Link to="/app/chats">
		        	<i className={`fa fa-comment ${newMessagesCount>0 && "bell-icon"}`}></i>{newMessagesCount>0 && <span className="badge count-badge">{newMessagesCount}</span>}
		        	<br/>
							Messages
						</Link>
		      </div>
	      </div>
				<div className={`nav-item ${(metaDetails.path === "alerts") && "nav-item-active"}`} title="Alerts">
					<div className="nav-link text-center">
		        <Link to="/app/alerts">
		        	<i className={`fa fa-bell ${newAlertsCount>0 && "bell-icon"}`}></i>{newAlertsCount>0 && <span className="badge count-badge">{newAlertsCount}</span>}
		        	<br/>
		        	Alerts
		        </Link>
      		</div>
      	</div>
				<div className={`nav-item ${(metaDetails.path === "profile") && "nav-item-active"}`} title="Profile">
					<div className="nav-link text-center">
		        <Link to="/app/profile">
		        	<i className="fa fa-user"></i><br/>
		        	Profile
		        </Link>
      		</div>
      	</div>
    	</div>
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
)(BottomHeaderComponent);