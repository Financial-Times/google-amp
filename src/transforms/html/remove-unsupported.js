'use strict';

const match = require('@quarterto/cheerio-match-multiple');
const {h, Component} = require('preact');

module.exports = class RemoveUnsupported extends Component {
	static selector = 'ft-content, ft-concept, ft-embedded-content';

	static preprocess() {}

	render() {
		return null
	}
};
