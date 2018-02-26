'use strict';

const {Component} = require('preact');

module.exports = (sel, modify) => class SimpleTransform extends Component {
	static selector = sel;

	static preprocess({original}) {
		return {original};
	}

	render({original}) {
		const modified = modify(original);

		if(modified && modified.nodeName) {
			return modified;
		}

		return original;
	}
}
