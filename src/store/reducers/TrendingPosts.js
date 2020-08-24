import {
	SET_TRENDING_POSTS,
	SET_POSTS
} from "../types";

const INITIAL_STATE = {
	trendingPosts: [],
	posts: []
}

const Posts = (state=INITIAL_STATE, action) => {
	const { payload } = action;
	switch (action.type) {
		case SET_TRENDING_POSTS: {
			return {
				...state,
				trendingPosts: payload.trendingPosts
			}
		}
		case SET_POSTS: {
			return {
				...state,
				posts: payload.posts
			}
		}
		default:
			return state;
	}
}

export default Posts;