import { getQuery, firestore } from "firebase_config";

export const getRelationships = async (currentUser, type) => {
	let relations = await getQuery(
		firestore.collection("userRelationships").where("userIdOne", "==", currentUser.id).get()
	);
	return relations;
}