import { combineReducers } from "redux";
import authUsers from "./AuthUsers";
import subscriptionPlans from "./SubscriptionPlans";
import conversations from "./Conversations";
import chatMessages from "./ChatMessages";

export default combineReducers({
	subscriptionPlans,
	authUsers,
	conversations,
	chatMessages
});