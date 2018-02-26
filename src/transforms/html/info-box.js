'use strict';

const {Component} = require('preact');

module.exports = class InfoBox extends Component {
	static selector = '.n-content-info-box';

	static preprocess({original}) {
		return {original};
	}

	render({original}) {
		original.attributes.class = 'promo-box c-box u-border--all u-padding--left-right';
		return original;
	}
};
