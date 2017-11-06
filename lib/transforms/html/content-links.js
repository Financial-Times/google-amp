'use strict';

var _class, _temp;

const match = require('@quarterto/cheerio-match-multiple');
const { h, Component } = require('preact');

module.exports = (_temp = _class = class ContentLink extends Component {

	static preprocess({ el, original }) {
		return {
			href: `https://www.ft.com${el.attribs.href}`,
			original
		};
	}

	render({ href, original }) {
		original.attributes.href = href;
		return original;
	}
}, _class.selector = 'a[href^="/content"]', _temp);
