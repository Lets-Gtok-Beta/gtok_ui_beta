import { SEARCH_USERS } from "../types";

const INITIAL_STATE = {
	plans: []
}

const subscriptionPlans = (state=INITIAL_STATE, action) => {
	const { payload } = action;
	switch (action.type) {
		case SEARCH_USERS: {
			return {
				...state,
				users: payload.users
			};
		}
		default:
			return state;
	}
}

export default subscriptionPlans;