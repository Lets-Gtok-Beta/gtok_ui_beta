import * as fb from "firebase";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";

// const admin = require('firebase-admin');

const config = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_DATABASE_URL,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_ID,
	measurementId: process.env.REACT_APP_MEASUREMENT_ID
};
// if (!firebase.apps.length) {
	firebase.initializeApp(config);
// }

export const auth = firebase.auth();
export const storage = firebase.storage();
export const firestore = fb.firestore();

export const initFirebaseUser = () => {
	/*
	client.writeData({
		data: {
			isAuthInitialized: true
		}
	});
	*/
	auth.onAuthStateChanged(user => {
		const isAuthenticated = user != null;

		if (isAuthenticated) {
			user.getIdToken().then(accessToken => {
				user = user.toJSON();
				// There are 2 ways to get accessToken (Step 1)
					// 1. Get the token from firebase
				//	let accessToken = user.stsTokenManager.accessToken;
				
				// 2. Set token to sessionStorage
				setToken(accessToken);
				// history.push('/home');
				// 3. Check for the user in local database
				// return getAuthenticatedUser(client, user);
			})
		} else {
			setToken("");
			// client.resetStore();
		}
	});
};

/*
export const googleSignin = () => {
	let provider = new firebase.auth.GoogleAuthProvider();
	provider.addScope("https://www.googleapis.com/auth/plus.login");
	return auth.signInWithPopup(provider).then(() => {
		window.location.reload();
	});
};
*/

/* Signup Code */
export const signup = ({email, password}) => {
  return auth.createUserWithEmailAndPassword(email, password)
	  .then(async (res) => {
	    if (res.user) {
	    	let userJson = res.user.toJSON();
	    	let user = Object.assign(userJson.providerData[0], {
	    		followers: []
	    	});
	    	let firestoreStatus = await addToFirestore('users', user);
	    	if (firestoreStatus) {
		    	return formatResult(200, 'Successfully created');
	    	}
	    	return formatResult(422, 'Not created!');
	    }
	  })
    .catch(e => formatResult(422, e.message));
}

export const googleSignup = () => {
  let provider = new firebase.auth.GoogleAuthProvider();

  firebase
  .auth()
  .setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => {
      firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => formatResult(200, 'Successfully created'))
	    .catch(e => formatResult(422, e.message));
    })
}

/* Signin Code */
export const signin = ({email, password}) => {
  return auth.signInWithEmailAndPassword(email, password)
    .then(res => {
      if (res.user) {
	    	return formatResult(200, 'Successfully loggedIn');
      }
    })
    .catch(e => formatResult(422, e.message));
}

export const googleSignin = () => {
  let provider = new firebase.auth.GoogleAuthProvider();

  firebase
  .auth()
  .setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => {
      firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => formatResult(200, 'Successfully created'))
	    .catch(e => formatResult(422, e.message));
    })
}

/* Signout Code */
export const signout = () => {
	return auth.signOut().then(() => {
		window.sessionStorage.setItem("token", '');
	});
};

export const setToken = accessToken => {
	window.sessionStorage.setItem("token", accessToken);
};

export const getToken = accessToken => {
	return window.sessionStorage.getItem("token");
};

export const updateProfile = (data) => {
	let currentUser = firebase.auth().currentUser;
	return currentUser.updateProfile(data)
		.then((suc) => {
			return { status: 200, message: "Successfully updated" };
		})
		.catch(err => {
			return { status: 400, message: "Try after some time" };
		})
}

export const removeProfile = () => {
	let currentUser = firebase.auth().currentUser;
	return currentUser.delete()
		.then(suc => formatResult(200, 'Deleted successfully'))
		.catch(err => formatResult(500, err.message))
}

export const uploadImage = ({
	file, setResult, setBtnUpload, setProfileUrl
}) => {
	let storageRef = storage.ref();
	let imageRef = storageRef.child("avatars/" + file.name);
	let metadata = {
		contentType: file.type,
		contentSize: file.size
	}
	let uploadTask = imageRef.put(file, metadata);
	uploadTask.on( "state_changed",
		(snapshot) => {
			let progress =
				(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			setBtnUpload(progress + "%");
			switch (snapshot.state) {
				case "paused":
					console.log("Upload is paused");
					break;
				case "running":
					console.log("Upload is running");
					break;
				default:
					break;
			}
		},
		(err) => {
			switch (err.code) {
				case "storage/unauthorized":
					err["message"] = 'Unauthorized user';
					break;
				case "storage/cancelled":
					err["message"] = 'Upload cancelled';
					break;
				case "storage/unknown":
					err["message"] = 'Unknown error occured';
					console.log(
						"unknown error occured, inspect err.serverResponse"
					);
					break;
				default:
					break;
			}
			setResult(err);
		},
		(res) => {
			uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
				setProfileUrl(downloadUrl);
				setBtnUpload('Uploaded');
			});
		}
	);
}

export const removeImage = (imageUrl) => {
	let imageRef = storage.refFromURL(imageUrl);
	return imageRef.delete()
		.then(suc => formatResult(200, "Deleted successfully"))
		.catch(err => formatResult(422, "Delete failed"))
}

export const addToFirestore = (collection, data) => {
	data['createdAt'] = new Date().getTime();
	data['updatedAt'] = new Date().getTime();
	return firestore.collection(collection).add(data)
		.then(res => formatResult(200, 'Successfully created', res))
		.catch(e => formatResult(500, 'Something went wrong'))
}

export const add = (collection, data) => {
	data['createdAt'] = new Date().getTime();
	data['updatedAt'] = new Date().getTime();
	return firestore.collection(collection).add(data)
		.then(res => formatResult(200, 'Successfully created', res))
		.catch(e => formatResult(500, 'Something went wrong'))
}

export const update = (collection, id, data) => {
	data['updatedAt'] = new Date().getTime();
	return firestore.collection(collection).doc(id).update(data)
		.then(() => formatResult(200, 'Successfully updated'))
		.catch(e => formatResult(422, e.message));
}

export const get = (collection, id="all") => {
	let snapshot = firestore.collection(collection).get();

	return snapshot.then((results) => {
			let object = []
			results.forEach(doc => {
				object.push({
					id: doc.id,
					...doc.data()
				})
			});
			return object.sort((a, b) => a.createdAt - b.createdAt);
		})
		.catch((err) => {
			console.error(err);
			return {error: err.code}
		});
}

export const getQuery = (customQuery=null) => {
	return customQuery.then((results) => {
			let object = []
			results.forEach(doc => {
				object.push({
					id: doc.id,
					...doc.data()
				})
			});
			return object.sort((a, b) => a.createdAt - b.createdAt);
		})
		.catch((err) => {
			console.error(err);
			return {error: err.code}
		});
}

export const getId = (collection, id) => {
	return firestore.collection(collection).doc(id).get()
		.then(doc => doc.exists ? doc.data() : formatResult(404, "No data found"))
		.catch((err) => formatResult(err.code, err.message));
}

export const remove = (collection, id) => {
	return firestore.collection(collection).doc(id).delete()
		.then(suc => formatResult(200, 'Deleted successfully'))
		.catch(er => formatResult(500, er.message));
}

export const arrayAdd = firebase.firestore.FieldValue.arrayUnion;

export const arrayRemove = firebase.firestore.FieldValue.arrayRemove;

/* Common code */
function formatResult(status, message, data={}) {
	return { status, message, data };
}

export default firebase;