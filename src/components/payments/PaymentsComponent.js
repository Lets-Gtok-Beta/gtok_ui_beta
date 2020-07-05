import React, { useState, useContext, useReducer } from "react";
import { useHistory, Link } from 'react-router-dom';
import { connect } from "react-redux";
import { SetSubscriptionPlans } from "store/actions";
import { get } from "firebase_config";

const PaymentsComponent = ({plans, bindSubscriptionPlans}) => {
	const [ selectedPlan, setSelectedPlan ] = useState("");
  const history = useHistory();
  
  const getPlans = async () => {
		let content = await get("subscription_plans");
		bindSubscriptionPlans(content);
  }
  if (!plans[0]) getPlans();

  const checkout = () => {
  	// Redirect to checkout page
  	if (!selectedPlan) { 
  		alert("No plan selected");
  		return;
  	}
  }

  return (
    <div className="container">
    	<div className="pull-right">
    		<button className="btn btn-outline-danger" onClick={checkout}>Checkout</button>
    	</div>
    	<br/>
    	<div className="row">
    	  {
    	  	plans && plans.map((plan, i) => (
		  			<div className="col-sm-4 mt-5" key={i}>
							<div className="card subscription-plan-card" style={{width: "18rem"}}>
								<div className="card-header bg-danger text-white text-center text-uppercase p-1">
									{plan.header}
								</div>
							  <div className="body">
									<div className="text-center pt-3 pb-2">
									  <h6>{plan.months} month{plan.months > 1 && "s"}</h6>
									</div>
							  	<h3 className="text-center pt-2 pb-2">
									  <input className="form-check-input" type="radio" name="subscription_plan" id={i} onChange={e => setSelectedPlan(plan)}/>
									  <label htmlFor={i}>
						  			{plan.currency === "gbp" ? <span>&#163;</span> : (
						  				plan.currency === "inr" ? <span>&#8377;</span> : (
						  					plan.currency === "usd" ? <span>&#36;</span> : ''
						  				)
						  			)}
							  		{plan.amount_per_week}<small className="small" style={{fontSize: "14px"}}>/week</small>
							  		</label>
							  	</h3>
							  	<ul className="payment-card-list">
							  		{
							  			plan.features.map((feature, i) => (
							  				<li key={i}>{feature}</li>
							  			))
							  		}
							  	</ul>
							  </div>
							</div>
						</div>
    	  	))
    	  }
    	</div>
    </div>
  )
};

const mapStateToProps = (state) => {
	const { plans } = state.subscriptionPlans;
	return { plans };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindSubscriptionPlans: (content) => dispatch(SetSubscriptionPlans(content))
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(PaymentsComponent);