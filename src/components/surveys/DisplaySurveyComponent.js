import React, { useState, useEffect } from "react";
import { useHistory, withRouter } from 'react-router-dom';

import { add, getId } from "firebase_config";
import { NotificationComponent, ModalComponent, FormFieldsComponent } from "components";
import { convertTextToJson } from "helpers";

const DisplaySurveyComponent = (props) => {
	const { currentUser } = props;
	const [ survey, setSurvey ] = useState("");
	const [ result, setResult ] = useState({});
	const [ response, setResponse ] = useState({});
	const [ mandatory, setMandatory ] = useState(false);
	const [ btnSave, setBtnSave ] = useState("Save");
	const [ surveyText, setSurveyText ] = useState("");
	let surveyId = props.match.params.id;
	const redirectTo = props.location.state && props.location.state.redirectTo;
	const query = new URLSearchParams(props.location.search);
	const history = useHistory();

	useEffect(() => {
		if (!surveyId) { return; }
		async function getSurvey() {
			let survey = await getId("surveys", surveyId);
			setSurvey(survey);
		}
		if (surveyId !== "new") {
			getSurvey();
		}
		window.jQuery("#modal").modal("show");
	}, [surveyId])

	const modalBody = () => {
		return surveyId === "new" ? 		
		<div>
			<div className="d-flex bd-highlight">
		    <div className="p-1 bd-highlight">
		      <input type="checkbox" className="form-input" id="userName" value={mandatory} onChange={e => setMandatory(e.target.value)} />
		    </div>
		    <label htmlFor="userName" className="p-1 bd-highlight col-form-label">Mandatory</label>
		  </div>
	    <textarea className="survey-textbox" rows={15} placeholder="Survey details..." onChange={e => setSurveyText(e.target.value)}></textarea>
    </div> : 
		survey && survey.values && survey.values.map((val, idx) => (
			<FormFieldsComponent ques={val} key={idx} response={response} setResponse={setResponse}/>
		));
	}

	const checkBeforeSave = () => {
		if (surveyId !== "new" &&
			survey.values.length !== Object.keys(response).length
		) {
			alert("All questions are mandatory.")
			return false;
		}
		return true;
	}

	const onSave = async () => {
		if (surveyId==="new" && !currentUser.admin) history.push('/error');
		setBtnSave("Saving...");
		setResult({
			status: 100,
			message: 'Processing...'
		});

		// Declare variables here
		let result = "";
		if (surveyId === "new") {
			let data = convertTextToJson(surveyText);
			data["originalText"] = surveyText;
			if (mandatory) { data['mandatory'] = true	}
			result = await add('surveys', data);
		} else {
			let data = {
				userId: currentUser.id,
				survey_id: surveyId
			}
			data = Object.assign(data, {response: response});
			if (!!query.get("edit")) {
				// await update("surveyResponses", surveyId, data);
			} else {
				result = await add("survey_responses", data)
				setResult(result);
			}
		}
		// props.setRefresh(!props.refresh);
		// onClose();
	}

	const onClose = () => {
		surveyId = "";
		window.jQuery("#modal").modal("hide");
		if (redirectTo && redirectTo.path) {
			history.push(redirectTo.path);
			return;
		}
		history.push("/app/surveys");
	}

	return (
		<div>
	  	{
	  		result.status && <NotificationComponent result={result} setResult={setResult} />
	  	}
			{surveyId && 
				<ModalComponent body={modalBody} header={surveyId === "new" ? "Add a new survey" : survey.title} subHeader={survey.sub_title || ""} save={onSave} close={onClose} btnSave={btnSave} beforeSave={checkBeforeSave}/>
			}
		</div>
	)
}

export default withRouter(DisplaySurveyComponent);