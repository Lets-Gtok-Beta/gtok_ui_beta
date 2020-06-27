import React, { useState } from "react";

const ModalComponent = ({header, subHeader, body, save, close}) => {
	const [ btnSave, setBtnSave ] = useState("Save");

	const saveModal = async () => {
		if (window.confirm("Are you sure to save?")) {		
			setBtnSave("Saving...")
			await save();
			setBtnSave("Saved!")
		}
	}

	return (
		<div className="modal fade" id="modal" tabIndex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		  <div className="modal-dialog" role="document">
		    <div className="modal-content">
		      <div className="modal-header">
		        <h6 className="modal-title" id="modalLabel">{header}</h6>
		        {close ? 
			        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={close}>Close</button>
			        :
  		        <button type="button" className="btn btn-sm btn-outline-secondary" data-dismiss="modal">Close</button>
		        }
		      </div>
		      <div className="modal-body">
		      	<p className="modal-subtitle">{subHeader}</p>
		      	{body()}
		      </div>
		      <div className="modal-footer">
		      	<small className="text-danger text-center">
		      	*Make sure you entered everything correctly. You cannot edit once you save.
		      	</small>
		        {close ? 
			        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={close}>Close</button>
			        :
  		        <button type="button" className="btn btn-sm btn-outline-secondary" data-dismiss="modal">Close</button>
		        }
		        <button type="button" className="btn btn-sm btn-success" onClick={e => saveModal(e)} disabled={btnSave !== 'Save'}>{btnSave}</button>
		      </div>
		    </div>
		  </div>
		</div>
	);
}

export default ModalComponent;