'use strict';

const match = require('@quarterto/cheerio-match-multiple');

const getTweetId = tweetHref => tweetHref.match(/\/(\d+?)$/)[1];
const tweetQuote = tweetHref => `<amp-twitter
	width="600"
	height="250"
	layout="responsive"
	data-tweetid="${getTweetId(tweetHref)}">
</amp-twitter>`;

module.exports = match({
	'blockquote' (el) {
		el.attr('class', 'article__quote article__quote--full-quote aside--content c-box u-border--left u-padding--left-right');
	},

	'blockquote.twitter-tweet' (el) {
		const lastTweetLink = el.find('a[href^="https://twitter.com/"]').last();
		return tweetQuote(lastTweetLink.attr('href'));
	},

	'a[href^="https://twitter.com/"]' (el) {
		return tweetQuote(el.attr('href'));
	}
});