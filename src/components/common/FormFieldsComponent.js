import React from "react";

const FormFieldsComponent = ({ques, response, setResponse}) => {
	const setArrayValues = (key, val, refKey) => {
		if (!response[key]) {
			response[key] = {};			
		}
		response[key][refKey] = val;
		setResponse(response);
	}

	let typeGeneral = () => (
    <input type={ques.type} className="form-control survey-input" id="typeGeneral" placeholder="Your response here..." required={ques.required === "true"} onChange={e => setResponse({...response, [ques.qId]: e.target.value})}/>
	);
	let typeFile = () => (
    <input type="file" className="form-control survey-input" id="typeFile" required={ques.required === "true"} onChange={e => setResponse({...response, [ques.qId]: e.target.value})}/>
	);
	let typeRadio = () => (
		<div>
			{
				ques.value.map((val, idx) => (
					<div className="form-check" key={idx}>
					  <input className="form-check-input" type="radio" name={ques.qId} id={ques.qId+"."+idx} value={val} onChange={e => setResponse({...response, [ques.qId]: e.target.value})} />
					  <label className="form-check-label" htmlFor={ques.qId+"."+idx}>
						  {val ? val : (<div className="d-flex flex-row align-items-center"> 
						  	<div className="">Other</div>
						  	<div className="pl-2">
						  		<input type="text" className="form-control survey-input" placeholder="Other" onChange={e => setResponse({...response, [ques.qId]: e.target.value})}/>
						  	</div>
						  </div>) }
					  </label>
					</div>
				))
			}
		</div>
	);
	let typeCheckbox = () => (
		<div>
			{
				ques.value.map((val, idx) => (
					<div className="form-check" key={idx}>
					  <input className="form-check-input" type="checkbox" name={ques.qId} id={ques.qId+"."+idx} value={val} onChange={e => setArrayValues(ques.qId, e.target.value, idx)}/>
					  <label className="form-check-label" htmlFor={ques.qId+"."+idx}>
						  {val ? val : (<div className="d-flex flex-row align-items-center"> 
						  	<div className="">Other</div>
						  	<div className="pl-2">
						  		<input type="text" className="form-control survey-input" placeholder="Other" onChange={e => setArrayValues(ques.qId, e.target.value, idx)}/> 
						  	</div>
						  </div>) }
					  </label>
					</div>
				))
			}
		</div>
	);
	let typeDropdown = () => (
		<div>
			<select className="custom-select" onChange={e => setResponse({...response, [ques.qId]: e.target.value})}>
			  <option defaultValue>Select value</option>
				{
					ques.value.map((val, idx) => (
						<option value={val ? val : 'Other'} key={idx}>{val ? val : 'Other'}</option>
					))
				}
			</select>
		</div>
	);
	return (
		<div className="form-group">
	    <label htmlFor={ques.qId} className="survey-question mb-0">
	    {ques.question} <span className={`text-danger ${ques.required !== "true" && "d-none"}`} title="Required">*</span>
	    </label>
			{
				ques.type === 'file' ? typeFile() : (
					ques.type === 'radio' ? typeRadio() : (
						ques.type === 'checkbox' ? typeCheckbox() : (
							ques.type === 'dropdown' ? typeDropdown() : typeGeneral()
						)
					)
				)
			}
		</div>
	)
}

export default FormFieldsComponent;