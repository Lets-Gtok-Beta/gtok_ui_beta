// Ref1#https://www.codedodle.com/2014/12/social-network-friends-database.html
import { add, update, getQuery, firestore, timestamp } from "firebase_config";

export const createRelationships = async (currentUser, displayUser, status) => {
	// const StatusCodes = {
	// 	0: "Pending",
	// 	1: "Accepted/Followed",
	// 	2: "Declined",
	// 	3: "Blocked"
	// }
	let res = "";
	let logsData = {
		text: `${currentUser.displayName} followed you`,
		photoURL: currentUser.photoURL,
		receiverId: "",
		userId: currentUser.id,
		actionType: "create",
		collection: "userRelationships",
		actionId: "",
		actionKey: "followers",
		timestamp
	}
	let data = {
		userIdOne: currentUser.id,
		userIdTwo: displayUser.id,
		status: displayUser["permissions"]["private"] ? 0 : 1,
		actionUserId: currentUser.id
	}
	let rln = await getQuery(
		firestore.collection("userRelationships").where("userIdOne", "==", currentUser.id).where("userIdTwo", "==", displayUser.id).get()
	);
	if (!rln[0]) {
		if (status === "follow" && !rln) {
			res = await add("userRelationships", data);
		}
	} else {
		rln = rln[0];
	 	if (status === "follow" && rln["status"] === null) {
			res = await update("userRelationships", rln.id, { status: data["status"],	actionUserId: data["actionUserId"]});
		} else if (
			status === "unfollow" || status === "unblock" || status === "cancel_request"
		) {
			if (status === "unfollow") {
				logsData["text"] = `${currentUser.displayName} blocked you`;
				logsData["actionType"] = "update";
				logsData["actionId"] = rln.id;
				logsData["actionKey"] = "block";
			} else if (status === "unblock") {
				logsData["text"] = `${currentUser.displayName} unblocked you`;
				logsData["actionType"] = "update";
				logsData["actionId"] = rln.id;
				logsData["actionKey"] = "unblock";
			} else if (status === "cancel_request") {
				logsData["text"] = `${currentUser.displayName} declined your request`;
				logsData["actionType"] = "update";
				logsData["actionId"] = rln.id;
				logsData["actionKey"] = "decline";
			}
			res = await update("userRelationships", rln.id, { status: null,	actionUserId: currentUser.id});
		} else if (status === "block") {
			logsData["text"] = `${currentUser.displayName} blocked you`;
			logsData["actionType"] = "update";
			logsData["actionId"] = rln.id;
			logsData["actionKey"] = "block";
			res = await update("userRelationships", rln.id, {status: 3, actionUserId:currentUser.id});
		}
	}
	if (!!res) {
  	await add("logs", logsData);
	}
	return res;
}