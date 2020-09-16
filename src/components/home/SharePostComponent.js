import React, { useState, useEffect } from "react";
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton
} from "react-share";

import { NotificationComponent } from "components";
import { SetSharePost } from "store/actions";
import { HelmetMetaDataComponent, DisplayPostComponent, LoadingComponent } from "components";

const SharePostComponent = (props) => {
	const { sharePost, currentUser, bindSharePost } = props;
	const [result, setResult ] = useState("");
	const [copied, setCopied ] = useState(false);
	let postId = props.match.params.id;
	let sharePostUrl = "https://beta.letsgtok.com/app/posts/"+props.match.params.id;

	useEffect(() => {
		if (!sharePost || !sharePost.id) {
			bindSharePost(currentUser, "id", {id: postId});
		}
	}, [bindSharePost, sharePost, currentUser, postId]);

  const copyLink = () => {
  	navigator.clipboard.writeText(sharePostUrl);
  	setCopied(true);
  	setTimeout(() => {
  		setCopied(false);
  	}, 1500);
  }

  const copiedLinkAlert = () => (
  	<div className="page-top-alert"> Link Copied </div>
  );

	return sharePost && sharePost.id ? (
		<div className="container pt-3">
    	{copied && copiedLinkAlert() }
			{result.status && <NotificationComponent result={result} setResult={setResult}/>}
			<HelmetMetaDataComponent currentUrl={sharePostUrl} title={sharePost.category.title} description={sharePost.text} />
			<DisplayPostComponent currentUser={currentUser} post={sharePost} setResult={setResult} hideShareBtn={true} />
			{console.log("URL", sharePostUrl)}
			<div className="d-flex flex-row align-items-center">
			  <div className="copy-link-icon" onClick={copyLink}>
			  	<i className="fa fa-link pt-2 pl-2"></i>
			  </div>
			  <FacebookShareButton url={sharePostUrl} title={sharePost.category.title} quote={sharePost.text} hashtag="#letsgtok" className="socialMediaButton">
			  	<FacebookIcon size={36}/>
			  </FacebookShareButton>
				<TwitterShareButton url={sharePostUrl} title={sharePost.text} hashtag="#letsgtok" className="socialMediaButton">
		     <TwitterIcon size={36} />
		   </TwitterShareButton>
		   <WhatsappShareButton url={sharePostUrl} title={sharePost.text} separator=":: " className="socialMediaButton">
		     <WhatsappIcon size={36} />
		   </WhatsappShareButton>
		  </div>
	  </div>
	) : <LoadingComponent />
}

const mapStateToProps = (state) => {
	const { sharePost } = state.posts;
	return { sharePost };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindSharePost: (content, type, data) => dispatch(SetSharePost(content, type, data))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(SharePostComponent));