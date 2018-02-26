'use strict';

const {Component} = require('preact');

module.exports = class InfoBoxContent extends Component {
	static selector = '.n-content-info-box__content';

	static preprocess({original}) {
		return {original};
	}

	render({original}) {
		original.attributes.class = 'promo-box__content';
		return original;
	}
};
