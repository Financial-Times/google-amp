'use strict';

const url = require('url');
const match = require('@quarterto/cheerio-match-multiple');
const reportError = require('../../report-error');

const validProtocols = [
	'ftp', 'http', 'https', 'mailto', 'fb-messenger', 'skype',
	'sms', 'tel', 'threema', 'viber', 'whatsapp',
];

// See https://github.com/ampproject/amphtml/blob/main/validator/validator-main.protoascii
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

module.exports = match({
	'a' (el, i, $, options) {
		try {
			validateHref(el.attr('href'));
		} catch(e) {
			reportError(options.raven, e, {
				extra: {
					linkHtml: $.html(el),
				},
			});

			el.replaceWith(el.contents());
		}
	},
});
