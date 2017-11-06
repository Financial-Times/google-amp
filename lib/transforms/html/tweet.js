'use strict';

var _class, _temp;

const { h, Component } = require('preact');

module.exports = (_temp = _class = class Tweet extends Component {

	static preprocess({ el }) {
		const { 'data-tweet-id': tweetId } = el.attribs;
		return { tweetId };
	}

	render({ tweetId }) {
		return h('amp-twitter', {
			width: '600',
			height: '250',
			layout: 'responsive',
			'data-tweetid': tweetId });
	}
}, _class.selector = 'blockquote[data-tweet-id]', _temp);
