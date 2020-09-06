import { SET_RELATIONSHIPS, SET_USER_RELATION } from "../types";

const INITIAL_STATE = {
	relations: [],
	userRelation: {}
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
		case SET_USER_RELATION: {
			return {
				...state,
				userRelation: payload.rls[0]
			}
		}
		default:
			return state;
	}
}

export default relationships;