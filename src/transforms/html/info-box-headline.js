'use strict';

const {Component} = require('preact');

module.exports = class InfoBoxHeadline extends Component {
	static selector = '.n-content-info-box__headline';

	static preprocess({original}) {
		return {original};
	}

	render({original}) {
		original.attributes.class = 'promo-box__headline';
		return original;
	}
};
