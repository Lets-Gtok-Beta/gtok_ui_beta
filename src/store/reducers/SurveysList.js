import { SET_SURVEYS_LIST } from "../types";

const INITIAL_STATE = {
	surveysList: []
}

const surveysList = (state=INITIAL_STATE, action) => {
	const { payload } = action;
	switch (action.type) {
		case SET_SURVEYS_LIST: {
			return {
				...state,
				surveysList: payload.surveys
			}
		}
		default:
			return state;
	}
}

export default surveysList;