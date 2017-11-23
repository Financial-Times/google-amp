'use strict';

const match = require('@quarterto/cheerio-match-multiple');

module.exports = match({
	'ft-content, ft-concept, picture, picture > source, ft-embedded-content'(el) {
		return el.contents();
	},
});
