'use strict';

const match = require('@quarterto/cheerio-match-multiple');

module.exports = match({
	'[style]' (el) {
		el.removeAttr('style');
	}
});
