'use strict';

const {is} = require('css-select');

const findParent = (el, selector) => {
	if(is(el, selector)) {
		return el;
	}

	if(el.parent) {
		return findParent(el.parent, selector);
	}

	return null;
};

module.exports = findParent;
