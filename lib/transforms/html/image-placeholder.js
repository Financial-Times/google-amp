'use strict';

const match = require('@quarterto/cheerio-match-multiple');

module.exports = match({
	'amp-img'(el) {
		const width = parseInt(el.attr('data-original-width'), 10);
		const height = parseInt(el.attr('data-original-height'), 10);

		if (width && height) {
			el.wrap('<div class="article-image__placeholder">');
		}
	}
});
