import { SET_NEW_ALERTS_COUNT } from "../types";

const INITIAL_STATE = {
	newAlertsCount: []
}

const Alerts = (state=INITIAL_STATE, action) => {
	const { payload } = action;
	switch (action.type) {
		case SET_NEW_ALERTS_COUNT: {
			return {
				...state,
				newAlertsCount: payload.newAlertsCount
			}
		}
		default:
			return state;
	}
}

export default Alerts;