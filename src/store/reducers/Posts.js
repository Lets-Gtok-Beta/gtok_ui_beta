import {
	SET_TRENDING_POSTS,
	SET_POSTS,
	SET_SELECTED_USER_POSTS,
	SET_SHARE_POST
} from "../types";

const INITIAL_STATE = {
	trendingPosts: [],
	posts: [],
	selectedUserPosts: [],
	sharePost: {}
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
		case SET_SELECTED_USER_POSTS: {
			return {
				...state,
				selectedUserPosts: payload.selectedUserPosts
			}
		}
		case SET_SHARE_POST: {
			return {
				...state,
				sharePost: payload.sharePost
			}
		}
		default:
			return state;
	}
}

export default Posts;