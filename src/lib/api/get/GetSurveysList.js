import { get, getQuery, firestore } from "firebase_config";

export const getSurveysList = async (currentUser) => {
	let surveys = [];
	if (currentUser.admin) {
		surveys = await get("surveys");
	} else {
		surveys = await getQuery(
			firestore.collection('surveys').where("active", "==", true).get()
		);
	}
	surveys = surveys.sort((a,b) => a.createdAt - b.createdAt);
	return surveys;
}
