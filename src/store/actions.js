import { 
	SET_SUBSCRIPTION_PLANS,
	SET_USER,
	SET_DB_USER,
	SET_LOGGED_IN,
	SET_RELOAD,
	SET_CHAT_MESSAGES,
	SET_CONVOS,
	SET_SURVEYS_LIST
} from "./types.js";

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

export const SetSurveysList = (content) => {
	return {
		type: SET_SURVEYS_LIST,
		payload: {
			surveys: content
		}
	}
}
