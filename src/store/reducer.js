const initialState = {
	user: null
}

const Reducer = (state=initialState, action) => {
	switch (action.type) {
		case 'UPDATE_USER': {
			return {
				...state,
				user: action.payload.user
			}
		}
		default:
			throw new Error('Unexpected action');
	}
}

export default Reducer;