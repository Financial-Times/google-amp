'use strict';

const match = require('@quarterto/cheerio-match-multiple');

module.exports = match({
	'.subhead'(el) {
		el.attr('class', (i, klass) => klass.replace(/subhead/g, 'article__subhead'));
	},
});
