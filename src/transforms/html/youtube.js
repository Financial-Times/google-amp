'use strict';

const {h, Component} = require('preact');
const url = require('url');

module.exports = class Youtube extends Component {
	static selector = 'iframe[src^="https://www.youtube.com/embed/"]';

	static preprocess({el}) {
		const {pathname} = url.parse(el.attribs.src);
		const [, videoId] = pathname.match(/\/embed\/(.+)$/) || [];
		return {videoId};
	}

	render({videoId}) {
		return <amp-youtube
			data-videoid={videoId}
			layout="responsive"
			width="480" height="270">
		</amp-youtube>;
	}
};
