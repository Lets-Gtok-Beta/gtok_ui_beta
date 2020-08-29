import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { SearchUserComponent } from "components";
import { SetAllUsers } from "store/actions";

const SearchComponent = ({currentUser, allUsers, bindAllUsers}) => {
	const [ searchVal, setSearchVal ] = useState("");
	const [ voiceIcon, setVoiceIcon ] = useState("microphone");
	const [ microphoneText, setMicrophoneText ] = useState("");

  useEffect(() => {
		window.jQuery('[data-toggle="popover"]').popover();
  	if (!allUsers[0] && !searchVal) {
			if (currentUser.admin) bindAllUsers(currentUser, "adminUsers");
			else bindAllUsers(currentUser, "all");
  	}
  }, [currentUser, allUsers, bindAllUsers, searchVal]);

/*
  const isFollower = async (user) => {
  	return user.followers && user.followers.find(u => u.id === currentUser.id);
  }

  const followUser = async (user) => {
  	let followers = user.followers || [];
  	followers.push(currentUser.id);
  	await update("users", user.id, { followers });
  	alert("Successfully followed!");
  }

  const unFollowUser = async (user) => {
  	let followers = user.followers || [];
  	followers = followers.filter(u => u.id != currentUser.id);
  	await update("users", user.id, { followers });
  	alert("Unfollowed successfully!");
  }
*/
	const searchValue = async (val) => {
		if (val.includes("search")) {
			val = val.replace("search", "").trim().toLowerCase();
		}
		if (!!val) {
			val = val.trim().toLowerCase();
		}
		if (val.includes("clear search") ||
			val.includes("clear all") ||
			val.includes("show all") ||
			val.includes("show me all")
		) {
			val = "";
		}
		await bindAllUsers(currentUser, "search", val);
		setSearchVal(val);
		if (!!val && !allUsers[0]) {
			// readoutLoud("No search results found");
		}
	}

	const initiateSpeech = async (actionType="") => {
		try {
			var SpeechRecognition = window.SpeechRecogntion || window.webkitSpeechRecognition;
			var recognition = new SpeechRecognition();
		}
		catch(e) {
			console.log("e", e);
		}

		recognition.continuous = true;
		recognition.onresult = function(event) {
		  var current = event.resultIndex;
		  var transcript = event.results[current][0].transcript;

		  var mobileRepeatBug = (current === 1 && transcript === event.results[0][0].transcript);

		  if(!mobileRepeatBug) {
		    // noteContent += transcript;
		    // noteTextarea.val(noteContent);
		    setMicrophoneText(transcript);
		    searchValue(transcript);
		  }
			setVoiceIcon("pause");
		};

		recognition.onstart = function() {
			setMicrophoneText("Voice recognition activated. Try speaking into microphone");
			setVoiceIcon("pause");
		}

		recognition.onend = function() {
			setMicrophoneText("Voice recognition stopped.");
			setVoiceIcon("microphone");
		}

		recognition.onspeechend = function() {
			setMicrophoneText("You were quiet for a while so voice recognition turned itself off.");
			setVoiceIcon("microphone");
		}

		recognition.onerror = function(e) {
			if (e.error === "no-speech") {
				setMicrophoneText("No speech was detected. Try again.");				
				setVoiceIcon("microphone");
			}
		}

		recognition.onnomatch = function(e) {
			setMicrophoneText("No match found");
		}

		if (actionType === "start") {
			recognition.start();
		}
		if (actionType === "stop") {
			recognition.stop();
			setVoiceIcon("microphone");
		}
	}

/*
	const readoutLoud = (text) => {
		var speech = new SpeechSynthesisUtterance();

	  // Set the text and voice attributes.
		speech.text = text ? text : (microphoneText ? microphoneText : "Nothing to search");
		speech.volume = 1;
		speech.rate = 1;
		speech.pitch = 1;
	  
		window.speechSynthesis.speak(speech);
		setMicrophoneText(speech.text);
	}
*/
  return (
    <div className="container">
    	<div className="d-flex">
				<div className="input-group my-3">
				  <input type="text" className="form-control br-0" aria-label="Search" placeholder="Search on names..." onChange={e => searchValue(e.target.value)}/>
				  <div className="input-group-append d-none">
				  	{
				  		voiceIcon !== "microphone" ?
					    <span className="input-group-text" onClick={e =>initiateSpeech("stop")}>
					    	<i className="fa fa-pause-circle-o"></i>
					    </span> :
					    <span className="input-group-text" onClick={e =>initiateSpeech("start")}>
					    	<i className="fa fa-microphone"></i>
					    </span>
				  	}
				  {/*
				    <span className="input-group-text" onClick={e => readoutLoud()}>
				    	<i className="fa fa-volume-control-phone"></i>
				    </span>
				  */}
				    <span className="input-group-text">
			      	<i className="fa fa-search" data-container="body" data-toggle="popover" data-placement="right" data-content="Try to speack 'search <YOUR_NAME>' For example - search Naga, search Prabha"></i> <br/>
				    </span>
				  </div>
				</div>
    	</div>
    	{microphoneText}
    	{
    		allUsers[0] ? allUsers.map((user, idx) => 
  				<SearchUserComponent displayUser={user} currentUser={currentUser} key={idx} />
  			) : <div className="card text-center mt-2 p-2 text-secondary">No users found</div>
    	}
    </div>
  );
};

const mapStateToProps = (state) => {
	const { allUsers } = state.users;
	return { allUsers };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindAllUsers: (content, type, searchVal) => dispatch(SetAllUsers(content, type, searchVal))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchComponent);