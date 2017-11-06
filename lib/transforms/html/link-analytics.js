'use strict';

const match = require('@quarterto/cheerio-match-multiple');

const sanitise = text => text.replace(/[^\w ]/g, '');

module.exports = match({
	'[data-trackable="related-box"] a'(el) {
		this.a(el);
		el.attr('data-vars-link-type', 'related-box');
	},

	'a'(el) {
		// Ensure text doesn't contain HTML chars
		const text = sanitise(el.text());

		// Ensure URLs don't break out of data attribute
		const href = el.attr('href').replace('"', '%22');

		if (!el.attr('data-vars-link-destination')) {
			el.attr('data-vars-link-destination', href);
		}

		if (!el.attr('data-vars-link-type')) {
			el.attr('data-vars-link-type', 'inline');
		}

		if (!el.attr('data-vars-link-text') && text) {
			el.attr('data-vars-link-text', text);
		}
	}
});
