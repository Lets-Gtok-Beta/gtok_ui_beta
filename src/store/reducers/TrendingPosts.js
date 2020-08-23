import { SET_TRENDING_POSTS } from "../types";

const INITIAL_STATE = {
	trendingPosts: []
}

const TrendingPosts = (state=INITIAL_STATE, action) => {
	const { payload } = action;
	switch (action.type) {
		case SET_TRENDING_POSTS: {
			return {
				...state,
				trendingPosts: payload.trendingPosts
			}
		}
		default:
			return state;
	}
}

export default TrendingPosts;