'use strict';

const match = require('@quarterto/cheerio-match-multiple');

module.exports = match({
	'ft-content' (el) {
		return el.contents();
	}
});
