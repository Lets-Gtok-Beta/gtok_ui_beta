import { combineReducers } from "redux";
import authUsers from "./AuthUsers";
import subscriptionPlans from "./SubscriptionPlans";

export default combineReducers({subscriptionPlans, authUsers});