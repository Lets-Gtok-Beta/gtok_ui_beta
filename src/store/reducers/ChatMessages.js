import { SET_CHAT_MESSAGES } from "../types";

const INITIAL_STATE = {
	messages: []
}

const ChatMessages = (state=INITIAL_STATE, action) => {
	const { payload } = action;
	switch (action.type) {
		case SET_CHAT_MESSAGES: {
			return {
				...state,
				messages: payload.messages
			};
		}
		default:
			return state;
	}
}

export default ChatMessages;