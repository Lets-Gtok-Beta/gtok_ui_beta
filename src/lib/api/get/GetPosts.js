import { get, getId, getQuery, firestore } from "firebase_config";
import _ from "lodash";

export const getPosts = async (currentUser, type="all", data={}) => {
	let posts = [];
	if (type==="id") {
		if (data.post) return data.post;
		posts = await getId("posts", data.id);
		posts["id"] = data.id;
		return posts;
	}

	if (type==="selectedUser") {
		posts = await getQuery(
		firestore.collection("posts").where("userId", "==", currentUser.id).get()
		);
	} else if (type==="trending") {
		posts = await getQuery(
		firestore.collection("posts").where("followersCount", ">", 0).orderBy("followersCount", "desc").limit(3).get()
		);
	} else {
		posts = await get("posts")
		posts = _.sortBy(posts, [
			o => o.category.title,
			o => o.createdAt
		]);
		// posts = posts.map(async (post) => {
		// 	post["user"] = await getId("users", post.userId);
		// 	return post;
		// });
	}
	if (data.sort) {
		posts = posts.sort((a,b) => b.createdAt - a.createdAt);		
	}
	return posts;
}
