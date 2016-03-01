const fetch = require('node-fetch');

const validateStreamUrl = (url) => fetch(url)
	.then(res => res.status === 200);

module.exports = (article) => {
	const primaryTheme = (article.metadata || []).filter(item => !!item.primary)[0];
	if(!primaryTheme) return;

	const streamUrl = `http://www.ft.com/stream/${primaryTheme.taxonomy}Id/${primaryTheme.idV1}`;
	return validateStreamUrl(streamUrl)
		.then(valid => {
			if(!valid) return;

			article.primaryTheme = {
				url: streamUrl,
				name: primaryTheme.prefLabel,
			};
		})
		.catch(() => {});
};
