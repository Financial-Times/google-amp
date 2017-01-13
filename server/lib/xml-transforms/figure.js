'use strict';

const match = require('@quarterto/cheerio-match-multiple');

module.exports = match({
	'figure.n-content-image + p'(el, i, $) {
		console.log($.html(el));
	},

	'figure.n-content-image'(el) {
		const img = el.find('amp-img');
		const width = parseInt(img.attr('data-original-width'), 10);
		const height = parseInt(img.attr('data-original-height'), 10);
		const origClass = img.attr('data-original-class');

		let variation;

		if(/emoticon/.test(origClass)) {
			variation = 'emoticon';
		} else if(width <= 150) {
			variation = 'thin';
		} else if(width <= 350) {
			variation = 'inline';
		} else if(width < height && width < 600) {
			variation = 'inline';
		} else if(width < 700) {
			variation = 'center';
		} else {
			variation = 'full';
		}

		if(width && height) {
			img.wrap('<div class="article-image__placeholder">');
		}

		img.removeAttr('data-original-width');
		img.removeAttr('data-original-height');
		img.removeAttr('data-original-class');

		el.attr('class', `article-image article-image--${variation}`);
	},
});
