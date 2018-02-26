'use strict';

const Youtube = require('./youtube');
const {h, Component} = require('preact');

module.exports = class YoutubeContainer extends Component {
	static selector = '.video-container-youtube:has([data-asset-ref])';

	static preprocess({match}) {
		const ref = match('[data-asset-ref]')[0];

		return {
			videoId: ref.attributes['data-asset-ref'],
		};
	}

	render({videoId}) {
		return <Youtube videoId={videoId} />;
	}
};
