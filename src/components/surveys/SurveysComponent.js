import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { get, getQuery, remove, firestore } from "firebase_config";
import { AddSurveyComponent, DisplaySurveyComponent, NotificationComponent} from "components";

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
		if (id === 'new') {
			history.push({
				pathname: '/app/surveys',
				search: `?newSurvey=true`
			});
		} else {
			if (isSurveyFilled(id) && !currentUser.admin) { 
				return alert("This survey is already filled.")
			}
			history.push({
				pathname: '/app/surveys',
				search: `?surveyId=${id}`,
				state: { redirectTo }
			});
		}
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
  			return survey.canDisplayToUser && (
					<div key={idx}>
		      	{survey.mandatory && <i className="fa fa-star text-danger"></i>}
			      <button className={`btn btn-sm ${isSurveyFilled(survey.id) ? "btn-primary" : "btn-outline-primary"}`} onClick={e => openSurveyModal(survey.id)} data-target="#modal" data-toggle="modal">
						  {survey.title}
						</button> &nbsp;
						{ !redirectTo.path && <i className={`fa fa-pencil ${!currentUser.admin && 'd-none'}`} onClick={e => removeSurvey(survey.id)} title="Edit survey"></i>	}
						&nbsp;
						{ !redirectTo.path && <i className={`fa fa-trash ${!currentUser.admin && 'd-none'}`} onClick={e => removeSurvey(survey.id)} title="Remove survey"></i>}
					</div>
	  		)
	  	})}
	  	<br/>
    	<small className="text-left">
    		Note : &nbsp;
      	<i className="fa fa-star text-danger" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Mandatory survey. You need to complete this to proceed further."></i>
      </small>

      <DisplaySurveyComponent currentUser={currentUser} setRefresh={setRefresh} refresh={refresh} />
      {	!redirectTo.path && 
				<div className="text-center">
				  <button className={`btn btn-danger ${currentUser.admin ? '' : 'd-none'}`} onClick={e => openSurveyModal('new')}>
					  Add a survey
					</button>
				</div>
      }
      <AddSurveyComponent currentUser={currentUser} setRefresh={setRefresh} refresh={refresh}/>
    </div>
  );
};

export default SurveysComponent;