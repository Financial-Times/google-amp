'use strict';

var _class, _temp;

const { h, Component } = require('preact');

module.exports = (_temp = _class = class Figure extends Component {

	static preprocess({ match, original }) {
		const img = match('img')[0];
		const { width, height, className } = img.attributes;

		let variation;

		if (/emoticon/.test(className)) {
			variation = 'emoticon';
		} else if (width <= 150) {
			variation = 'thin';
		} else if (width <= 350) {
			variation = 'inline';
		} else if (width < height && width < 600) {
			variation = 'inline';
		} else if (width < 700) {
			variation = 'center';
		} else {
			variation = 'full';
		}

		return { variation, original };
	}

	render({ variation, original }) {
		console.log(variation, original);
		return original;
	}
}, _class.selector = 'figure.n-content-image', _temp);
