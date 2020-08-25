import { 
	SET_SUBSCRIPTION_PLANS,
	SET_USER,
	SET_DB_USER,
	SET_LOGGED_IN,
	SET_RELOAD,
	SET_CHAT_MESSAGES,
	SET_CONVOS,
	SET_SURVEYS_LIST,
	SET_NEW_MESSAGES_COUNT,
	SET_NEW_ALERTS_COUNT,
	SET_TRENDING_POSTS,
	SET_POSTS,
	SET_SELECTED_USER_POSTS
} from "./types.js";
import { 
	getNewMessagesCount,
	getNewAlertsCount,
	getSurveysList,
	getPosts
} from "lib/api";

export const SetUserLocation = (currentUser) => {
	return (dispatch) => {
		if (!navigator.geolocation) {
			console.log("Geolocation is not supported by your browser");
			return;
		}
		fetch('https://extreme-ip-lookup.com/json/')
			.then( res => res.json())
			.then(response => {
			    console.log("Country: ", response);
			 })
			 .catch((data, status) => {
			    console.log('Request failed');
			 })
	}
}

export const SetDbUser = (content) => {
	return {
		type: SET_DB_USER,
		payload: {
			dbUser: content
		}
	}
}

export const SetUser = (content) => {
	return {
		type: SET_USER,
		payload: {
			user: content
		}
	}
}

export const SetLoggedIn = (content) => {
	return {
		type: SET_LOGGED_IN,
		payload: {
			loggedIn: content
		}
	}
}

export const SetReload = (content) => {
	return {
		type: SET_RELOAD,
		payload: {
			reload: content
		}
	}
}

export const SetSubscriptionPlans = (content) => {
	return {
		type: SET_SUBSCRIPTION_PLANS,
		payload: {
			plans: content
		}
	}
}

export const SetChatMessages = (content) => {
	return {
		type: SET_CHAT_MESSAGES,
		payload: {
			messages: content
		}
	}
}

export const SetConvos = (content) => {
	return {
		type: SET_CONVOS,
		payload: {
			convos: content
		}
	}
}

export const SetSurveysList = (currentUser) => {
	return (dispatch) => {
		getSurveysList(currentUser).then(res => {
			dispatch({
				type: SET_SURVEYS_LIST,
				payload: {
					surveys: res
				}				
			});
		});
	}
}

export const SetNewMessagesCount = (currentUser) => {
	return (dispatch) => {
		getNewMessagesCount(currentUser).then(res => {
			dispatch({
				type: SET_NEW_MESSAGES_COUNT,
				payload: {
					newMessagesCount: res
				}
			});
		});
	}
}

export const SetNewAlertsCount = (currentUser) => {
	return (dispatch) => {
		getNewAlertsCount(currentUser).then(res => {
			dispatch({
				type: SET_NEW_ALERTS_COUNT,
				payload: {
					newAlertsCount: res
				}
			});
		});
	}
}

export const SetTrendingPosts = (currentUser) => {
	return (dispatch) => {
		getPosts(currentUser, "trending").then(res => {
			dispatch({
				type: SET_TRENDING_POSTS,
				payload: {
					trendingPosts: res
				}
			});
		});
	}
}

export const SetPosts = (currentUser) => {
	return (dispatch) => {
		getPosts(currentUser, "all").then(res => {
			dispatch({
				type: SET_POSTS,
				payload: {
					posts: res
				}
			});
		});
	}
}

export const SetSelectedUserPosts = (currentUser) => {
	return (dispatch) => {
		getPosts(currentUser, "selectedUser").then(res => {
			dispatch({
				type: SET_SELECTED_USER_POSTS,
				payload: {
					selectedUserPosts: res
				}
			});
		});
	}
}