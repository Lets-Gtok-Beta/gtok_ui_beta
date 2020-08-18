import { getQuery, firestore } from "firebase_config";

export const getNewAlertsCount = async (currentUser) => {
	let alerts = await getQuery(
		firestore.collection("logs").where("receiverId", "==", currentUser.id).where("timestamp", ">", currentUser.updatedAt).get()
	);
	// .onSnapshot(snapshot => {
	// 	snapshot.docChanges().forEach(change => {
	// 		let alert = change.doc.data();
	// 		alertsCount += 1;
	// 	})
	// });
	return alerts.length;
}
