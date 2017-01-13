'use strict';

const match = require('@quarterto/cheerio-match-multiple');

const tweetQuote = tweetId => `<amp-twitter
	width="600"
	height="250"
	layout="responsive"
	data-tweetid="${tweetId}">
</amp-twitter>`;

module.exports = match({
	'blockquote'(el) {
		el.attr('class', 'article__quote article__quote--full-quote aside--content c-box u-border--left u-padding--left-right');
	},

	'blockquote[data-tweet-id]'(el) {
		return tweetQuote(el.data('tweet-id'));
	},
});
