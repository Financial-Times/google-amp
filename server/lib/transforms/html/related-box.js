'use strict';

const match = require('@quarterto/cheerio-match-multiple');

module.exports = match({
	'.n-content-related-box__headline' (el) {
		el.attr('class', 'aside--headline u-margin--left-right');
	},

	'.n-content-related-box__content' (el) {
		el.attr('class', 'aside--content u-margin--left-right');
	},

	'.n-content-related-box__title-text' (el, i, $) {
		return $('<div class="c-box__title-text u-background-color--pink">').append(el.contents());
	},

	'.n-content-related-box__title' (el, i, $) {
		return $('<div class="c-box__title">').append(el.contents());
	},

	'.n-content-related-box__image-link' (el) {
		el.attr('class', null);
		el.attr('data-trackable', 'link-image');
		el.wrap('<div class="aside--image">');
	},

	'.n-content-related-box' (el) {
		el.attr('class', 'c-box c-box--inline u-border--all');
		el.attr('data-trackable', 'related-box');
	},
});
