'use strict';

const url = require('./url');

module.exports = (article, options) => {
	const primaryTheme = (article.metadata || []).filter(item => !!item.primary)[0];
	if(!primaryTheme) return;

	return url.stream(primaryTheme, options)
		.then(streamUrl => {
			if(!streamUrl) return;

			article.primaryTheme = {
				url: streamUrl,
				name: primaryTheme.prefLabel,
			};
		});
};
