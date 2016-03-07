'use strict';
const getStreamUrl = require('./get-stream-url');

module.exports = (article) => {
	const primaryTheme = (article.metadata || []).filter(item => !!item.primary)[0];
	if(!primaryTheme) return;

	return getStreamUrl(primaryTheme)
		.then(streamUrl => {
			if(!streamUrl) return;

			article.primaryTheme = {
				url: streamUrl,
				name: primaryTheme.prefLabel,
			};
		})
		.catch(() => {});
};
