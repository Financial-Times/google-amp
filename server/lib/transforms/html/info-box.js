'use strict';

const match = require('@quarterto/cheerio-match-multiple');

module.exports = match({
	'.n-content-info-box__headline' (el) {
		el.attr('class', 'promo-box__headline');
	},

	'.n-content-info-box__content' (el) {
		el.attr('class', 'promo-box__content');
	},

	'.n-content-info-box' (el) {
		el.attr('class', 'promo-box c-box u-border--all u-padding--left-right');
	},
});
