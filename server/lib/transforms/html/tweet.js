'use strict';

const {h, Component} = require('preact');

module.exports = class Tweet extends Component {
	static selector = 'blockquote[data-tweet-id]';

	static preprocess({el}) {
		const {'data-tweet-id': tweetId} = el.attribs;
		return {tweetId};
	}

	render({tweetId}) {
		return <amp-twitter
			width="600"
			height="250"
			layout="responsive"
			data-tweetid={tweetId} />;
	}
}
