import React, { useState } from "react";
import { connect } from "react-redux";

import { getQuery, firestore } from "firebase_config";
import { SimilarityChecker } from "lib/api/SimilarityChecker";

const SimilarityComponent = ({
	currentUser, selectedUser, surveysList
}) => {
	const [ similarityResult, setSimilarityResult ] = useState();
	const [ similarityDescription, setSimilarityDescription ] = useState();

	const handleChange = async (val) => {
		let result = "";

		if (val === "last_2_days") {
			setSimilarityResult("No similarities found in last 2 days");
		} else {
			let responses = [];
			responses = await getQuery(
				firestore.collection("survey_responses").where("surveyId", "==", val).where("userId", "in", [currentUser.id, selectedUser.id]).get()
			);
			let userResponses = [];
			let res1 = responses.find(res => res.userId === currentUser.id);
			if (!!res1) userResponses.push(res1);
			res1 = responses.find(res => res.userId === selectedUser.id);
			if (!!res1) userResponses.push(res1);
			if (userResponses.length === 2) {
				result = await SimilarityChecker(responses);
				setSimilarityResult(result.common);
			} else {
				setSimilarityResult("No similarities found");
			}
			setSimilarityDescription(result.description);
		}
	}

	return (
		<div className="my-2 pt-1">
			{/*<LineGraphComponent data={Categories} />*/}
			<div className="d-flex flex-row">
				<div className="input-group px-1">
				  <div className="input-group-prepend">
				    <label className="input-group-text font-small" htmlFor="inputGroupSelect01">
				    Show similarities in
				    </label>
				  </div>
				  <select className="custom-select font-small" id="inputGroupSelect01" onChange={e => handleChange(e.target.value)}>
				    <option defaultValue value="">Choose...</option>
				    <option value="last_2_days">Last 2 days</option>
				    {
				    	surveysList.map(survey => (
				    		<option value={survey.id} key={survey.title}>{survey.title}</option>
				    	))
				    }
				  </select>
				</div>
			</div>
			{/*
				<label htmlFor="customRange1">{category.text} - {category.value}%</label>
				<input type="range" className="custom-range" id="customRange1" value={category.value} min="0" max="100"/>
			*/}
			{similarityResult && typeof(similarityResult) !== "string" ?
				(
					<div className="card p-4 mt-2">
						<div className="h5 text-center" dangerouslySetInnerHTML={{__html: similarityDescription}}>
						</div>
						<br/>
						<div className="h5 text-center text-secondary">Complete details</div>
						{
						similarityResult.map(sim => (
							<div key={sim.key}>{sim.key} - {sim.value}</div>
						))}
					</div>
				) : (
					<div className="card text-center p-2 mt-2 text-secondary">
						{similarityResult || "Select a similarity"}
					</div>
				)
			}
		</div>
	)
}

const mapStateToProps = (state) => {
	const { surveysList } = state.surveys;
	return { surveysList };
}

export default connect(
	mapStateToProps, 
	null
)(SimilarityComponent);