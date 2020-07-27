import React, { useState, useEffect } from "react";
import { useHistory, withRouter } from 'react-router-dom';

import { NotificationComponent, ModalComponent, LineGraphComponent } from "components";
import { Categories } from "constants/categories";

const CheckSimilarityComponent = ({currentUser, setOpenModal, selectedUser}) => {
	// const [ survey, setSurvey ] = useState("");
	const [ result, setResult ] = useState({});
	// const [ response, setResponse ] = useState({});
	// const query = new URLSearchParams(props.location.search);
	// let surveyId = query.get("surveyId");
	const history = useHistory();

	useEffect(() => {
		window.jQuery("#modal").modal("show");
	}, [])

	const modalBody = () => {
		return (
			<div>
				<button className="btn btn-outline-primary btn-sm">Today similarities</button>
				<LineGraphComponent data={Categories} />
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
	  	{
	  		result.status ? <NotificationComponent result={result} setResult={setResult} /> : ''
	  	}
			<ModalComponent body={modalBody} header={`Your similarities with ${selectedUser.displayName}`} modelWidth="xl" close={onClose}/>
		</div>
	)
}

export default withRouter(CheckSimilarityComponent);