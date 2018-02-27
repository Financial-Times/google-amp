'use strict';

const Youtube = require('./youtube');
const {h, Component} = require('preact');
const url = require('url');

module.exports = class YoutubeLink extends Component {
	static selector = 'p:has(a[href^="http://youtube.com/watch"]:empty), a[href^="http://youtube.com/watch"]:empty';

	static preprocess({match, original}) {
		const link = match('a')[0] || original;
		const {query: {v: videoId}} = url.parse(link.attributes.href, true);

		return {videoId};
	}

	render({videoId}) {
		return <Youtube videoId={videoId} />;
	}
};
