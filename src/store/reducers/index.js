import { combineReducers } from "redux";
import authUsers from "./AuthUsers";
import subscriptionPlans from "./SubscriptionPlans";
import permissions from "./Permissions";
import conversations from "./Conversations";
import chatMessages from "./ChatMessages";
import surveys from "./SurveysList";
import alerts from "./Alerts";
import posts from "./Posts";
import users from "./SearchUsers";
import relationships from "./Relationships";

export default combineReducers({
	subscriptionPlans,
	permissions,
	authUsers,
	conversations,
	chatMessages,
	surveys,
	alerts,
	posts,
	users,
	relationships
});