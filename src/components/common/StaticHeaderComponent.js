import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import { Helmet } from "react-helmet";
import { Metadata } from "constants/index";
import { gtokLogo, gtokFavicon } from "images";

const StaticHeaderComponent = ({routes}) => {
	const [metaDetails, setMetaDetails] = useState({});
	useEffect(() => {
		let path = window.location.pathname;
		if (path.includes("/app/chats")) {
			setMetaDetails(Metadata["/app/chats"])
		} else {
			setMetaDetails(Metadata[path]);			
		}
	}, [metaDetails]);

  return (
    <div>
    	<Helmet> 
    		<title>{metaDetails.title}</title>
				<meta name="description" content= {metaDetails.description}/>
        <meta name="keywords" content= {metaDetails.keywords} />
        <link rel="icon" type="image/png" href={gtokFavicon} sizes="16x16"/>
      </Helmet>
    	<nav className="navbar fixed-top navbar-expand-sm">
    		<div className="navbar-brand mr-auto">
	        <Link to="/signup">
	        	<img src={gtokLogo} alt="GTOK" style={{maxHeight: "26px", position: "relative", top: "-7px"}} />
	        </Link>
        	<span className="badge badge-danger beta-badge">Beta</span>
				</div>
				<button className="navbar-toggler navbar-toggler-right pull-right" type="button" data-toggle="collapse" data-target=".navbar-collapse" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
			    <span className="navbar-toggler-icon">
			    	<i className="fa fa-bars" style={{verticalAlign: "middle"}}></i>
			    </span>
			  </button>
			  <div className="collapse navbar-collapse">
			  	<ul className="navbar-nav ml-auto">
			  		{
			  			routes.map(r => (
								<li className="nav-item" key={r.route}>
									<div className="nav-link">
						        <Link to={r.route}>{r.title}</Link>
						      </div>
					      </li>
			  			))
			  		}
			  	</ul>
		    </div>
    	</nav>
    </div>
  );
};

export default StaticHeaderComponent;