'use strict';

const {Component} = require('preact');

module.exports = class ContentLink extends Component {
	static selector = 'a[href^="/content"]';

	static preprocess({el, original}) {
		return {
			href: `https://www.ft.com${el.attribs.href}`,
			original,
		};
	}

	render({href, original}) {
		original.attributes.href = href;
		return original;
	}
};
