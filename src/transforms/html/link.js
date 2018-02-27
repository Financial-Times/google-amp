'use strict';

const {Component} = require('preact');
const textContent = require('@quarterto/domhandler-text-content');
const {is} = require('css-select');

const findParent = (el, selector) => {
	if(is(el, selector)) {
		return el;
	}

	if(el.parent) {
		return findParent(el.parent, selector);
	}

	return null;
};

const sanitise = text => text.replace(/[^\w ]/g, '');

module.exports = class LinkAnalytics extends Component {
	static selector = 'a';

	static preprocess({original, el}) {
		const related = findParent(el, '.n-content-related-box');

		let href = original.attributes.href;

		if(href.startsWith('/content')) {
			href = `https://www.ft.com${href}`;
		}

		return {
			original,
			href,
			text: sanitise(textContent(el)),
			type: related ? 'related-box' : 'inline',
		};
	}

	render({original, text, href, type}) {
		Object.assign(original.attributes, {
			href,
			'data-vars-link-destination': href,
			'data-vars-link-type': type,
			'data-vars-link-text': text,
		});

		return original;
	}
};
