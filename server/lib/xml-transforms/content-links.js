'use strict';

const match = require('@quarterto/cheerio-match-multiple');

module.exports = match({
	'a[href^="/content"]'(el) {
		el.attr('href', (i, href) => `https://www.ft.com${href}`);
	},
});
