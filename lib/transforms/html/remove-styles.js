'use strict';

var _class, _temp;

const match = require('@quarterto/cheerio-match-multiple');

module.exports = (_temp = _class = class RemoveStyle {

	static preprocess(original) {
		return { original };
	}

	render({ original }) {
		original.attributes.style = null;
		return original;
	}
}, _class.selector = '[style]', _temp);
