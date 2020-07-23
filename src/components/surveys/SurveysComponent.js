import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { get, getQuery, remove, update, firestore } from "firebase_config";
import { NotificationComponent} from "components";

const SurveysComponent = ({currentUser, redirectTo={}}) => {
	const [ result, setResult ] = useState({});
	const [ surveysList, setSurveysList ] = useState([]);
	const [ filledSurveysList, setFilledSurveysList ] = useState([]);
	const [ refresh, setRefresh ] = useState(false);
	const history = useHistory();

	useEffect(() => {
		window.jQuery('[data-toggle="popover"]').popover();
		async function getSurveys() {
			let surveys = await get("surveys");
			setSurveysList(surveys.sort((a,b) => a.createdAt - b.createdAt));
		}
		getSurveys();
		async function getFilledSurveys() {
			let responses = await getQuery(firestore.collection('user_responses').where("user_email", "==", currentUser.email).get());
			let surveyIds = [];
			for (let r of responses) {
				surveyIds.push(r.survey_id);
			}
			setFilledSurveysList(surveyIds);
		}
		getFilledSurveys();
	}, [refresh, currentUser.email]);

	const openSurveyModal = async (id) => {
		if (isSurveyFilled(id) && !currentUser.admin && id !== "new") {
			return alert("This survey is already filled.")
		}
		history.push({
			pathname: '/app/surveys/'+id,
			state: { redirectTo }
		});
	}

	const editSurvey = async (id) => {
		history.push({
			pathname: '/app/surveys/'+id,
			search: `?edit=true`
		});
	}

	const removeSurvey = async (id) => {
		if (window.confirm("Are you sure to delete survey & it's responses?")) {		
			setResult({
				status: 100,
				message: 'Processing...'
			});
			let res = await remove('surveys', id);
			setResult(res);
			setRefresh(!refresh);
		}
	}

	const isSurveyFilled = (id) => {
		return !!filledSurveysList.find(i => i === id);
	}

	const setSurveyStatus = async (survey) => {
		survey["active"] = !survey.active;
		setSurveysList(surveysList.map(sur => (sur.id === survey.id) && survey));
		await update("surveys", survey.id, {active: survey.active});
	}

	return (
    <div className="container p-3">
	  	{
	  		result.status ? <NotificationComponent result={result} setResult={setResult} /> : ''
	  	}
      <h6 className="text-center">
      	To understand your interests and needs, these surveys are essential. &nbsp;
      	<i className="fa fa-info-circle" data-container="body" data-toggle="popover" data-placement="right" data-content="Surveys include different categories. Personal, Daily needs, Profession, Help, Fashion, Food habits, Mental health, Sexual health (18+), Normal health."></i> <br/>
      </h6>
  		{surveysList.map((survey, idx) => {
  			return (!currentUser.admin) ? survey.active && (
					<div key={idx}>
		      	{survey.mandatory && <i className="fa fa-star text-danger"></i>}
			      <button className={`btn btn-sm ${isSurveyFilled(survey.id) ? "btn-primary" : "btn-outline-primary"}`} onClick={e => openSurveyModal(survey.id)} data-target="#modal" data-toggle="modal">
						  {survey.title}
						</button> &nbsp;
					</div>
	  		) : (
					<div key={idx}>
					  <input className="form-check-input" type="checkbox" name={idx} id={survey.id} checked={survey.active} onChange={e => setSurveyStatus(survey)}/>
					  <label htmlFor={idx}>
			      	{survey.mandatory && <i className="fa fa-star text-danger"></i>}
				      <button className={`btn btn-sm ${isSurveyFilled(survey.id) ? "btn-primary" : "btn-outline-primary"}`} onClick={e => openSurveyModal(survey.id)} data-target="#modal" data-toggle="modal">
							  {survey.title}
							</button> &nbsp;
							<i className={`fa fa-pencil`} onClick={e => editSurvey(survey.id)} title="Edit survey"></i>
							&nbsp;
							<i className={`fa fa-trash`} onClick={e => removeSurvey(survey.id)} title="Remove survey"></i>
						</label>
					</div>
	  		)
	  	})}
	  	<br/>
    	<small className="text-left">
    		Note : &nbsp;
      	<i className="fa fa-star text-danger" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Mandatory survey. You need to complete this to proceed further."></i>
      </small>

      {	currentUser.admin && 
				<div className="text-center">
				  <button className="btn btn-danger" onClick={e => openSurveyModal('new')}>
					  Add a survey
					</button>
				</div>
      }
    </div>
  );
};

export default SurveysComponent;