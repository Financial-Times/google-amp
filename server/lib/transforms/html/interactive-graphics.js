'use strict';

const match = require('@quarterto/cheerio-match-multiple');

module.exports = match({
	'a[data-asset-type="interactive-graphic"]' (el, i, $) {
		if(el.attr('href').match(/^https/i)) {
			return `<amp-iframe
				src="${el.attr('href')}"
				sandbox="allow-scripts allow-same-origin"
				layout="responsive"
				frameborder="0"
				width="${el.data('width')}" height="${el.data('height')}">
			</amp-iframe>`;
		}

		return $('');
	},
});
