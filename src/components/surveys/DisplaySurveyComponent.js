import React, { useState, useContext, useEffect } from "react";
import { useHistory, withRouter } from 'react-router-dom';
import { add, getId, remove, firestore } from "firebase_config";
import { NotificationComponent, ModalComponent, FormFieldsComponent } from "components";

const DisplaySurveyComponent = (props) => {
	const { currentUser } = props;
	const [ survey, setSurvey ] = useState("");
	const [ result, setResult ] = useState({});
	const [ response, setResponse ] = useState({});
	const query = new URLSearchParams(props.location.search);
	let surveyId = query.get("surveyId");
	const history = useHistory();

	useEffect(() => {
		async function getSurvey() {
			if (!surveyId) { return; }
			window.jQuery("#modal").modal("show");
			let survey = await getId("surveys", surveyId);
			setSurvey(survey);
		}
		getSurvey();
	}, [surveyId])

	const modalBody = () => {
		return survey && survey.values && survey.values.map((val, idx) => (
			<FormFieldsComponent ques={val} key={idx} response={response} setResponse={setResponse}/>
		));
	}

	const onSave = async () => {
		let data = {
			user_email: currentUser.email,
			survey_id: surveyId
		}
		data = Object.assign(data, {response: response});

		let result = await add("user_responses", data)
		setResult(result);

		props.setRefresh(!props.refresh);
		onClose();
	}

	const onClose = () => {
		surveyId = "";
		window.jQuery("#modal").modal("hide");
		history.push("/app/surveys");
	}

	return (
		<div>
	  	{
	  		result.status ? <NotificationComponent result={result} setResult={setResult} /> : ''
	  	}
			{surveyId && 
				<ModalComponent body={modalBody} header={survey.title} subHeader={survey.sub_title} save={onSave} close={onClose}/>
			}
		</div>
	)
}

export default withRouter(DisplaySurveyComponent);