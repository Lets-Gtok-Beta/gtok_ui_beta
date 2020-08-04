import React, { useState, useEffect } from "react";
import { useHistory, Link } from 'react-router-dom';
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
		getSurveys();
		async function getFilledSurveys() {
			let responses = await getQuery(firestore.collection('survey_responses').where("userId", "==", currentUser.id).get());
			let surveyIds = [];
			for (let r of responses) {
				surveyIds.push(r.survey_id);
			}
			setFilledSurveysList(surveyIds);
		}
		getFilledSurveys();
	}, [refresh, currentUser]);

	const getSurveys = async () => {
		let surveys = await get("surveys");
		setSurveysList(surveys.sort((a,b) => a.createdAt - b.createdAt));
	}

	const openSurveyModal = async (id, survey={}) => {
		if (isSurveyFilled(id) && !currentUser.admin && id !== "new") {
			return alert(survey.title + " similarity is completed. Try another category.")
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
		await update("surveys", survey.id, {active: survey.active});
		await getSurveys();
	}

	return (
    <div className="container p-3">
	  	{
	  		result.status && <NotificationComponent result={result} setResult={setResult} />
	  	}
      <h6 className="text-center">
      	To compute similarity scale, you need to answer few questions in each category. &nbsp;
      	<i className="fa fa-info-circle" data-container="body" data-toggle="popover" data-placement="right" data-content="Categories include Personal, Daily needs, Profession, Help, Fashion, Food habits, Mental health, Sexual health (18+), Normal health."></i> <br/>
      </h6>
      {	currentUser.admin && 
      	<div className="d-flex align-content-end mt-4">
				  <button className="btn btn-danger" onClick={e => openSurveyModal('new')}>
					  <i className="fa fa-plus"></i> Add a survey
					</button>
					<Link to="/assets/files/SurveyTemplate.txt" target="_blank" download>
				  <button className="btn btn-danger ml-2 mt-xs-2 mt-md-0">
					  <i className="fa fa-download"></i> Download survey template
					</button>
					</Link>
				</div>
      }
      <div className="d-flex">
  		{surveysList.map((survey, idx) => {
  			return (!currentUser.admin) ? survey.active && (
					<div key={idx}>
			      <button className={`btn btn-sm ${isSurveyFilled(survey.id) ? "btn-primary" : "btn-outline-primary"}`} onClick={e => openSurveyModal(survey.id, survey)} data-target="#modal" data-toggle="modal">
						  {survey.title}
						</button> &nbsp;
					</div>
	  		) : (
					<div key={idx} className="mt-2 ml-5">
					  <input className="form-check-input" type="checkbox" name={idx} id={survey.id} checked={survey.active} onChange={e => setSurveyStatus(survey)}/>
					  <label htmlFor={idx}>
				      <button className={`btn btn-sm ${isSurveyFilled(survey.id) ? "btn-primary" : "btn-outline-primary"}`} onClick={e => openSurveyModal(survey.id, survey)} data-target="#modal" data-toggle="modal">
							  {survey.title}
							</button> &nbsp;
							<i className={`fa fa-pencil`} onClick={e => editSurvey(survey.id)} title="Edit survey"></i>
							&nbsp;
							<i className={`fa fa-trash`} onClick={e => removeSurvey(survey.id)} title="Remove survey"></i>
						</label>
		      	{survey.mandatory && <i className="fa fa-star text-danger"></i>}
					</div>
	  		)
	  	})}
	  	</div>
	  	<br/>
    	<small className="text-left">
    		Note : &nbsp;
      	<i className="fa fa-star text-danger" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Mandatory survey. You need to complete this to proceed further."></i>
      </small>
    </div>
  );
};

export default SurveysComponent;