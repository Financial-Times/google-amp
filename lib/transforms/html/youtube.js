'use strict';

var _class, _temp;

const { h, Component } = require('preact');
const url = require('url');

module.exports = (_temp = _class = class Youtube extends Component {

	static preprocess({ el }) {
		const { pathname } = url.parse(el.attribs.src);
		const [, videoId] = pathname.match(/\/embed\/(.+)$/) || [];
		return { videoId };
	}

	render({ videoId }) {
		return h('amp-youtube', {
			'data-videoid': videoId,
			layout: 'responsive',
			width: '480', height: '270' });
	}
}, _class.selector = 'iframe[src^="https://www.youtube.com/embed/"]', _temp);
