'use strict';

const {h, Component} = require('preact');
const textContent = require('@quarterto/domhandler-text-content');
// const match = require('@quarterto/cheerio-match-multiple');

const sanitise = text => text.replace(/[^\w ]/g, '');

module.exports = class LinkAnalytics extends Component {
	static selector = 'a';

	static preprocess({original, el}) {
		let href = original.attributes.href;

		if(href.startsWith('/content')) {
			href = `https://www.ft.com${href}`;
		}

		return {
			original,
			text: sanitise(textContent(el)),
			href,
		};
	}

	render({original, text, href}) {
		Object.assign(original.attributes, {
			href,
			'data-vars-link-destination': href,
			'data-vars-link-type': 'inline',
			'data-vars-link-text': text,
		});

		return original;
	}
};
