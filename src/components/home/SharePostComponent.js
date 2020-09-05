import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton
} from "react-share";

import {
	NotificationComponent,
	ModalComponent
} from "components";
import { SetSharePost } from "store/actions";
import { HelmetMetaDataComponent, DisplayPostComponent } from "components";

const SharePostComponent = (props) => {
	const { sharePost, currentUser, bindSharePost } = props;
	const [result, setResult ] = useState("");
	const history = useHistory();
	let postId = props.match.params.id;
	let sharePostUrl = "https://beta.letsgtok.com/app/posts/"+props.match.params.id;

	useEffect(() => {
		if (!sharePost || !sharePost.id) {
			bindSharePost(currentUser, "id", {id: postId})
		}
		window.jQuery("#modal").modal("show");
	}, [bindSharePost, sharePost, currentUser, postId]);

	const modalBody = () => {
		return sharePost && sharePost.id && (
			<div>
				{result.status && <NotificationComponent result={result} setResult={setResult}/>}
				<HelmetMetaDataComponent title={sharePost.category.title} description={sharePost.text} />
				<DisplayPostComponent currentUser={currentUser} post={sharePost} setResult={setResult} hideSimilarityBtn={true} hideShareBtn={true} hideRedirects={true}/>
				<div className="text-center">
				  <FacebookShareButton url={sharePostUrl} title={sharePost.category.title} quote={sharePost.text} hashtag="#letsgtok" className="socialMediaButton">
				  	<FacebookIcon size={36}/>
				  </FacebookShareButton>
					<TwitterShareButton url={sharePostUrl} title={sharePost.text} hashtag="#letsgtok" className="socialMediaButton">
			     <TwitterIcon size={36} />
			   </TwitterShareButton>
			   <WhatsappShareButton url={sharePostUrl} title={sharePost.category.text} separator=":" className="socialMediaButton">
			     <WhatsappIcon size={36} />
			   </WhatsappShareButton>
			  </div>
		  </div>
		)
	};

	const onClose = () => {
		window.jQuery("#modal").modal("hide");
		history.push("/app/home");
	}

	return (
		<div>
			<ModalComponent body={modalBody} header={sharePost && sharePost.id && ("Share about "+sharePost.category.title)} close={onClose} hideSaveBtn={true}/>
		</div>
	)
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