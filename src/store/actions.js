import { 
	SET_SUBSCRIPTION_PLANS,
	SET_USER,
	SET_DB_USER,
	SET_LOGGED_IN,
	SET_RELOAD,
	SET_CHAT_MESSAGES,
	SET_CONVOS,
	SET_SURVEYS_LIST,
	SET_SURVEYS_AFTER_RESPONSES,
	SET_NEW_MESSAGES_COUNT,
	SET_NEW_ALERTS_COUNT,
	SET_TRENDING_POSTS,
	SET_POSTS,
	SET_SELECTED_USER_POSTS,
	SET_ALL_USERS,
	SET_ALERTS,
	SET_PERMISSIONS,
	SET_SHARE_POST
} from "./types.js";
import {
	getNewMessagesCount,
	getNewAlertsCount,
	getSurveysList,
	getPosts,
	getUsers,
	getAlerts,
	getPermissions,
	createPageVisits
} from "lib/api";

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

export const SetSurveysAfterResponses = (currentUser, type="all") => {
	return (dispatch) => {
		getSurveysList(currentUser, type).then(res => {
			dispatch({
				type: SET_SURVEYS_AFTER_RESPONSES,
				payload: {
					surveysAfterResponses: res
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

export const SetSharePost = (currentUser, type="id", data) => {
	return (dispatch) => {
		getPosts(currentUser, type, data).then(res => {
			dispatch({
				type: SET_SHARE_POST,
				payload: {
					sharePost: res
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

export const SetAllUsers = (currentUser, type="all", searchVal="") => {
	return (dispatch) => {
		getUsers(currentUser, type, searchVal).then(res => {
			dispatch({
				type: SET_ALL_USERS,
				payload: {
					allUsers: res
				}
			});
		});
	}
}

export const SetAlerts = (currentUser, type="all") => {
	return (dispatch) => {
		getAlerts(currentUser, type).then(res => {
			dispatch({
				type: SET_ALERTS,
				payload: {
					alerts: res
				}
			});
		});
	}
}

export const SetPermissions = (currentUser) => {
	return (dispatch) => {
		getPermissions(currentUser).then(res => {
			dispatch({
				type: SET_PERMISSIONS,
				payload: {
					pms: res
				}
			});
		});
	}
}

export const CreatePageVisits = (currentUser) => {
	return (dispatch) => {
		createPageVisits(currentUser).then(res => {
			// dispatch({
			// 	type: SET_ALERTS,
			// 	payload: {
			// 		pageVisits: res
			// 	}
			// });
		});
	}
}