import React from "react";

const SupportComponent = ({currentUser}) => {
	return (
		<div className="container-fluid">
			<h4 className="text-center">How our app works?</h4>
			<div id="accordion">
			  <div className="card">
			    <div className="card-header" id="headingOne">
		        <button className="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
		          Step 1 : Fill surveys (Or) Chat with personal bot
		        </button>
			    </div>

			    <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#accordion">
			      <div className="card-body">
			        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
			      </div>
			    </div>
			  </div>
			  <div className="card">
			    <div className="card-header" id="headingTwo">
		        <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
		          Step 2 : Earn badges & Unlock features
		        </button>
			    </div>
			    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
			      <div className="card-body">
			        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
			      </div>
			    </div>
			  </div>
			  <div className="card">
			    <div className="card-header" id="headingThree">
		        <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#stepThree" aria-expanded="true" aria-controls="stepThree">
		          Step 3 : Find your similarity score with others
		        </button>
			    </div>
			    <div id="stepThree" className="collapse show" aria-labelledby="headingThree" data-parent="#accordion">
			      <div className="card-body">
			      	<b>What is GTOK similarity score?</b><br/>
			      	GTOK similarity score is a score which you will get after filling surveys. <br/>
			      	<b>How this score helps?</b><br/>
			      	You can find similarities between you and a stranger. If you find a similarity with others, you can chat each other and share opinions directly. <br/>
			      	<b>How will we find similarities?</b><br/>
			      	Our Artificial Intelligence algorithm will do it for us. It computes similarity score on 12 different categories (See categories list). Each category has a max score of 100 points, which means you can score a maximum of 1200 points in total. <br/>
			      	<b>How similarity score helps?</b><br/>
			      	Similarity score helps you to connect and understand others in a better way. You can find similarity scores with Friends, Colleagues, Partners, Strangers, Neighbors and so forth. Here are few examples -
			      	<ul>
			      		<li>If you are a fresher in college, its hard to find friends in your interests. Then, you can easily search for GTOK similarity score and start finding friends.</li>
			      		<li>If you are looking for a partner. Then, you can easily search GTOK similarity score before you start dating.</li>
			      		<li>If you started recently a new job. Then, you can easily search GTOK similarity score to find your Colleagues that interests you.</li>
			      		<li>If you moved to a new place with your family. Then, you can easily search GTOK similarity score with your neighbors and start doing friendship.</li>
			      		<li>If you are an employer who wants to hire an individual. Then, you can easily search GTOK similarity score before you hire a candidate.</li>
			      		<li>If you are an entrepreneur who wants to work with similar mindset. Then, GTOK similarity score perfectly suits you.</li>
			      	</ul><br/>
			      	<b>Lets GTOK each other and live happily.</b>			      	
			      </div>
			    </div>
			  </div>
			  <div className="card">
			    <div className="card-header" id="headingFour">
		        <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
		          Step 4 : Unlock premium features
		        </button>
			    </div>
			    <div id="collapseThree" className="collapse" aria-labelledby="headingFour" data-parent="#accordion">
			      <div className="card-body">
			        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
			      </div>
			    </div>
			  </div>
			</div>
		</div>
	)
}

export default SupportComponent;