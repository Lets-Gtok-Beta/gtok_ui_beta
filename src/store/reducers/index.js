import { combineReducers } from "redux";
import authUsers from "./AuthUsers";
import subscriptionPlans from "./SubscriptionPlans";
import conversations from "./Conversations";
import chatMessages from "./ChatMessages";
import surveys from "./SurveysList";
import alerts from "./Alerts";
import posts from "./TrendingPosts";

export default combineReducers({
	subscriptionPlans,
	authUsers,
	conversations,
	chatMessages,
	surveys,
	alerts,
	posts
});