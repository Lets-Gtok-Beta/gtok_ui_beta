import { getQuery, firestore } from "firebase_config";

export const getRelationships = async (currentUser, displayUser={}) => {
	let relations = [];

	if (!displayUser.id) {
		relations =	await getQuery(
			firestore.collection("userRelationships").where("userIdOne", "==", currentUser.id).get());
	} else {
		relations = await getQuery(
			firestore.collection("userRelationships").where("userIdOne", "==", currentUser.id).where("userIdTwo", "==", displayUser.id).get()
		);
	}
	return relations;
}