'use strict';

const match = require('@quarterto/cheerio-match-multiple');

module.exports = match({
	'ft-content, ft-concept, picture, picture > source'(el) {
		return el.contents();
	},
});
