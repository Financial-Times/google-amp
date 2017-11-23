'use strict';

const match = require('@quarterto/cheerio-match-multiple');
const {h, Component} = require('preact');

module.exports = class ReplaceUnsupported extends Component {
	static selector = 'ft-content, ft-concept, ft-embedded-content';

	static preprocess() {}

	render() {
		return null
	}
};
