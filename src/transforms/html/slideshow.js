'use strict';

const match = require('@quarterto/cheerio-match-multiple');
const apply = require('@quarterto/cheerio-apply');

module.exports = match({
	'p:has(a[href$="#slide0"])'(el, i, $) {
		const link = el.find('a[href$="#slide0"]');
		const slideshow = $(apply(this, 'a[href$="#slide0"]', el));
		const otherBits = el.contents().not(link);
		const paragraph = $('<p>').append(otherBits);

		return $.html(slideshow) + $.html(paragraph);
	},

	'a[href$="#slide0"]'(el) {
		const [, uuid] = el.attr('href').match(/(........-....-....-....-............)\.html#slide0$/);
		return `<ft-slideshow data-uuid="${uuid}" />`;
	},
});
