import React, { useState, useEffect } from "react";
import { useHistory, withRouter } from 'react-router-dom';
import { ResponsiveLine } from '@nivo/line'

import { NotificationComponent, ModalComponent } from "components";
import { ChartData } from "constants/index";

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
			<div style={{height: "400px"}}>
		    <ResponsiveLine
	        data={ChartData}
	        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
	        xScale={{ type: 'point' }}
	        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
	        curve="cardinal"
	        axisTop={null}
	        axisRight={null}
	        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Different categories',
            legendOffset: 36,
            legendPosition: 'middle'
	        }}
	        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Similarity score (Out of 300)',
            legendOffset: -40,
            legendPosition: 'middle'
	        }}
	        colors={{ scheme: 'nivo' }}
	        pointSize={10}
	        pointColor={{ from: 'color', modifiers: [] }}
	        pointBorderWidth={2}
	        pointBorderColor={{ from: 'color', modifiers: [] }}
	        pointLabel="y"
	        pointLabelYOffset={-12}
	        useMesh={true}
	        legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1
                  }
                }
              ]
            }
	        ]}
		    />
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