import React, { useState, useEffect } from "react";

/* Permissions reference: https://stackoverflow.com/questions/58128847/what-all-mobile-permission-we-can-ask-in-a-pwa */

const UserPermissionsComponent = () => {
	const [ hideNotify, setHideNotify ] = useState(true);
			// name: "notifications",
			// name: "geolocation",
			// name: "microphone",
			// name: "push",
			// name: "camera",
			// name: "persistent-storage"

	useEffect(() => {
		(async () => {
			navigator.permissions.query({name: "push", userVisibleOnly: true});
			navigator.permissions.query({name: "midi", sysex: true});
			navigator.permissions.query({name: "microphone"});
			navigator.permissions.query({name: "geolocation"});
			navigator.permissions.query({name: "camera"});
			// navigator.mediaDevices.getUserMedia({audio: true});
			setHideNotify(true);
		})();
		Notification.requestPermission(function(result) {
	    if (result === 'granted') {
	      navigator.serviceWorker.ready.then(function(registration) {
	        registration.showNotification('Lets Gtok', {
	          body: 'You received a new alert',
	          icon: 'https://beta.letsgtok.com/static/media/favicon.42ec26b0.png',
	          vibrate: [200, 100, 200, 100, 200, 100, 200],
	          tag: 'lets-gtok'
	        });
	      });
	    }
	  });
	}, []);

	return (
		<div className={`text-center ${hideNotify && "d-none"}`}>
			Please accept permissions.
		</div>
	)
}

export default UserPermissionsComponent;