'use strict';

const {Component} = require('preact');
const textContent = require('@quarterto/domhandler-text-content');
const findParent = require('../utils/find-parent');
const url = require('url');
const reportError = require('../../report-error');
const renderToString = require('@quarterto/preact-render-array-to-string');

const sanitise = text => text.replace(/[^\w ]/g, '');

const validProtocols = [
	'ftp', 'http', 'https', 'mailto', 'fb-messenger', 'skype',
	'sms', 'tel', 'threema', 'viber', 'whatsapp',
];

// See https://github.com/ampproject/amphtml/blob/master/validator/validator-main.protoascii
const validateHref = href => {
	// AMP links must have an href
	if(!href) {
		throw Error('Link with empty href');
	}

	const parsed = url.parse(href);
	const protocol = (parsed.protocol || '').replace(/:$/, '');

	// Require a valid protocol
	if(validProtocols.indexOf(protocol) === -1) {
		throw Error('Invalid link protocol');
	}
};

module.exports = class LinkAnalytics extends Component {
	static selector = 'a';

	static async preprocess({original, el, options = {}}) {
		const related = findParent(el, '.n-content-related-box');

		let href = original.attributes.href;

		if(href.startsWith('/content')) {
			href = `https://www.ft.com${href}`;
		}

		try {
			validateHref(href);
		} catch(e) {
			reportError(options.raven, e, {extra: {
				linkHtml: renderToString(original),
			}});

			return {original};
		}

		return {
			original,
			href,
			text: sanitise(textContent(el)) || null,
			type: related ? 'related-box' : 'inline',
		};
	}

	render({original, text, href, type}) {
		if(!href) {
			return original.children[0];
		}

		Object.assign(original.attributes, {
			href,
			'data-vars-link-destination': href,
			'data-vars-link-type': type,
			'data-vars-link-text': text,
		});

		return original;
	}
};
