import { SET_RELATIONSHIPS } from "../types";

const INITIAL_STATE = {
	relations: []
}

const relationships = (state=INITIAL_STATE, action) => {
	const { payload } = action;
	switch (action.type) {
		case SET_RELATIONSHIPS: {
			return {
				...state,
				relations: payload.rls
			}
		}
		default:
			return state;
	}
}

export default relationships;