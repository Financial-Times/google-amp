'use strict';

const {h, Component} = require('preact');

module.exports = class ContentLink extends Component {
	static selector = 'a[href^="/content"]';

	static preprocess({el, original}) {
		console.log(el);
		return {
			href: el.attribs.href,
			original
		};
	}

	render({href, original}) {
		original.attributes.href = href;
		return original;
	}
}
