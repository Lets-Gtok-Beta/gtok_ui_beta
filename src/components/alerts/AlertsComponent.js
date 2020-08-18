import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import moment from "moment";

import { getQuery, firestore } from "firebase_config";
import { gtokFavicon } from "images";
import { capitalizeFirstLetter } from "helpers";
import { LoadingComponent } from "components";

const AlertsComponent = ({currentUser}) => {
	const [ alerts, setAlerts ] = useState([]);
	const [ loading, setLoading ] = useState(true);

	useEffect(() => {
		async function getAlerts() {
			let responses = await getQuery(firestore.collection('logs').where("receiverId", "==", currentUser.id).get());
			setAlerts(responses.sort((a,b) => b.timestamp - a.timestamp));
			setLoading(false);
		}
		getAlerts();
	}, [currentUser]);

  return (
    <div className="container">
    	<div className="card">
    		<div className="card-header py-1 px-2">
    			<small>Recent Alerts</small>
    		</div>
    		{
    			loading ? <LoadingComponent /> : (
	    			alerts[0] ? alerts.map(alert => (
							<div className="media p-3" key={alert.id} style={{boxShadow: "1px 1px 2px gainsboro"}}>
						  	<Link to={"/app/profile/"+alert.userId}>
							  	<img className="mr-2" src={alert.photoURL || gtokFavicon} alt="Card img cap" style={{width: "37px", borderRadius: "50%"}} />
						  	</Link>
							  <div className="media-body">
							  	{capitalizeFirstLetter(alert.text)}<br/>
							  	<small className="pull-right text-secondary">
							  		{moment(alert.createdAt).fromNow()}
							  	</small>
							  </div>
							  <hr/>
						  </div>
	    			)) : <div className="text-secondary text-center p-2">No alerts to show</div>
    			)
    		}
    	</div>
    </div>
  );
};

export default AlertsComponent;