import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { connect } from "react-redux";

import { get, getQuery, firestore } from "firebase_config";
import { ModalComponent } from "components";
import { SimilarityCategories } from "constants/categories";
import { SimilarityChecker } from "lib/api/SimilarityChecker";
import { SetSurveysList } from "store/actions";

const CheckSimilarityComponent = ({
	currentUser, setOpenModal, selectedUser, surveysList, bindSurveysList
}) => {
	const [ similarityResult, setSimilarityResult ] = useState();
	const history = useHistory();

	useEffect(() => {
		window.jQuery("#modal").modal("show");
	}, []);

	const getSimilarities = async (category) => {
		let responses = await getQuery(
			firestore.collection("survey_responses").where("category", "==", category.id).where("userId", "in", [currentUser.id, selectedUser.id]).get()
		);
		console.log("responses", responses)
		let result = "";
		if (responses.length === 2) {
			result = await SimilarityChecker(responses);
		} else {
			result = selectedUser.displayName + " has not updated " + category.text + " yet";
		}
		setSimilarityResult(result)
	}

	const getSurveys = async () => {
		let surveys = [];
		if (currentUser.admin) {
			surveys = await get("surveys");
		} else {
			surveys = await getQuery(
				firestore.collection('surveys').where("active", "==", true).get()
			);
		}
		bindSurveysList(surveys.sort((a,b) => a.createdAt - b.createdAt));
	}
	if (!surveysList[0]) getSurveys();


	const modalBody = () => {
		return (
			<div>
				{/*<LineGraphComponent data={Categories} />*/}
				{
					SimilarityCategories.map(category => (
						<div key={category.id}>
							<button className="btn btn-sm btn-outline-primary" onClick={e => getSimilarities(category)}>{category.text}</button>
							{similarityResult && typeof(similarityResult) !== "string" ?
								(
									<div>
										You both similar in {similarityResult.length} {category.text.toLowerCase()}. <br/>
										{
										similarityResult.map(sim => (
											<div>{sim.key} - {sim.value}</div>
										))}
									</div>
								) : (
									<div className="text-center pt-2">
										{similarityResult}
									</div>
								)
							}
						{/*
							<label htmlFor="customRange1">{category.text} - {category.value}%</label>
							<input type="range" className="custom-range" id="customRange1" value={category.value} min="0" max="100"/>
						*/}
						</div>
					))
				}
			</div>
		);
	}

	const onClose = () => {
		// surveyId = "";
		window.jQuery("#modal").modal("hide");
		setOpenModal(false);
		history.push("/app/search");
	}
	return (
		<div>
			<ModalComponent body={modalBody} header={`Your similarities with ${selectedUser.displayName}`} modelWidth="xl" close={onClose}/>
		</div>
	)
}

const mapStateToProps = (state) => {
	const { surveysList } = state.surveys;
	return { surveysList };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindSurveysList: (content) => dispatch(SetSurveysList(content))
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(CheckSimilarityComponent);