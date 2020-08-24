import { get } from "firebase_config";

export const getPosts = async (currentUser) => {
	let posts = await get("posts");
	// posts = posts.map(async (post) => {
	// 	post["user"] = await getId("users", post.userId);
	// 	return post;
	// });
	return posts;
}
