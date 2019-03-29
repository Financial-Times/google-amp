'use strict';

const match = require('@quarterto/cheerio-match-multiple');

const tweetQuote = tweetId => `<amp-twitter
	width="600"
	height="250"
	layout="responsive"
	data-tweetid="${tweetId}">
</amp-twitter>`;

module.exports = match({
	'blockquote:not(.n-content-pullquote)'(el) {
		el.attr('class', 'article__quote article__quote--full-quote');
	},

	'blockquote.n-content-pullquote'(el) {
		el.attr('class', 'article__quote article__quote--pull-quote');
		el.prepend('<div class="pull-quote__quote-marks"></div>');
		el.find('.n-content-pullquote__footer').attr('class', 'article__quote-footer');
	},

	'blockquote[data-tweet-id]'(el) {
		return tweetQuote(el.data('tweet-id'));
	},
});
