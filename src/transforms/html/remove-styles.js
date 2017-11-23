'use strict';

const match = require('@quarterto/cheerio-match-multiple');

module.exports = class RemoveStyle {
	static selector = '[style]';

	static preprocess(original) {
		return {original}
	}

	render({original}) {
		original.attributes.style = null;
		return original;
	}
}
