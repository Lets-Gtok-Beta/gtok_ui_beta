import { get, getQuery, firestore } from "firebase_config";

export const getPosts = async (currentUser, type="all") => {
	let posts = [];
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
		// posts = posts.map(async (post) => {
		// 	post["user"] = await getId("users", post.userId);
		// 	return post;
		// });
	}
	posts = posts.sort((a,b) => b.createdAt - a.createdAt);
	return posts;
}
