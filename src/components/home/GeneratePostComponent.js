import React, { useState, useEffect } from "react";
import { useHistory, withRouter } from 'react-router-dom';
import { connect } from "react-redux";

import { add, timestamp } from "firebase_config";
import { NotificationComponent, ModalComponent, FormFieldsComponent } from "components";

const GeneratePostComponent = (props) => {
	const { currentUser, surveysList } = props;
	const [ survey, setSurvey ] = useState({});
	const [ response, setResponse ] = useState({});
	const [ result, setResult ] = useState({});
	const [ subHeader, setSubHeader ] = useState("");
	const history = useHistory();

	useEffect(() => {
		window.jQuery("#modal").modal("show");
	}, []);

	const handleChange = (val) => {
		let sur = surveysList.find(s => s.id === val);
		setSurvey(sur);
		setSubHeader("Answer following questions to generate a post about "+sur.title);
	}

	const modalBody = () => {
		return survey.title ?
			survey && survey.values && survey.values.map((val, idx) => (
				<FormFieldsComponent ques={val} key={idx} response={response} setResponse={setResponse}/>
			)) :
			<div className="input-group px-1">
			  <div className="input-group-prepend">
			    <label className="input-group-text font-small" htmlFor="inputGroupSelect01">
			    This post is about your
			    </label>
			  </div>
			  <select className="custom-select font-small" id="inputGroupSelect01" onChange={e => handleChange(e.target.value)} value={survey.title}>
			    <option defaultValue value="">Choose...</option>
			    {
			    	surveysList.map(survey => (
			    		<option value={survey.id} key={survey.title}>{survey.title}</option>
			    	))
			    }
			  </select>
			</div>
	};

	const checkBeforeSave = () => {
		if (!survey.title) {
			alert("Tell us about the post before you proceed 'Next'");
			return false;
		}
		if (survey.values.length !== Object.keys(response).length) {
			alert("All questions are mandatory. If your answer is unknown, write N/A");
			return false;
		}
		return true;
	}

	const onSave = async () => {
		let data = {
			userId: currentUser.id,
			surveyId: survey.id,
			category: survey.category,
			response
		}
		let result = await add("survey_responses", data)
		/* Log the activity */
  	await add("logs", {
  		text: `${currentUser.displayName} generated a post`,
  		photoURL: currentUser.photoURL,
  		receiverId: "",
  		userId: currentUser.id,
  		actionType: "create",
  		collection: "survey_responses",
  		actionKey: "surveyId",
  		actionId: survey.id,
  		timestamp
  	});
		setResult(result);
		onClose();
	}

	const onClose = () => {
		window.jQuery("#modal").modal("hide");
		history.push("/app/home");
	}

	return (
		<div>
	  	{
	  		result.status && <NotificationComponent result={result} setResult={setResult} />
	  	}
			<ModalComponent body={modalBody} header="Generate automated post" subHeader={subHeader} save={onSave} close={onClose} beforeSave={checkBeforeSave}/>
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
)(withRouter(GeneratePostComponent));