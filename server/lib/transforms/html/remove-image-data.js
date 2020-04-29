'use strict';

const match = require('@quarterto/cheerio-match-multiple');

module.exports = match({
	'[data-original-width]' (el) {
		el.removeAttr('data-original-width');
		el.removeAttr('data-original-height');
		el.removeAttr('data-original-class');
	},
});
