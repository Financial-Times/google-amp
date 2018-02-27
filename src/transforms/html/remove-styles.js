'use strict';

const {Component} = require('preact');

module.exports = class RemoveStyle extends Component {
	static selector = '[style]';

	static preprocess(original) {
		return {original};
	}

	render({original}) {
		original.attributes.style = null;
		return original;
	}
};
