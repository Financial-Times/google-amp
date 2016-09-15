'use strict';

const fetch = require('./wrap-fetch')(require('node-fetch'), {
	tag: 'url.stream',
});

module.exports.canonical = article => {
	switch(process.env.CANONICAL_URL_PHASE) {
		case '1':
			return `https://www.ft.com/content/${article.id}`;
		case '2':
			throw Error('Vanity URLs not yet supported');
		case '0':
		default:
			return article.webUrl;
	}
};

module.exports.external = uuid => {
	switch(process.env.CANONICAL_URL_PHASE) {
		case '1':
			return `https://www.ft.com/content/${uuid}`;
		case '2':
			throw Error('Vanity URLs not yet supported');
		case '0':
		default:
			return `http://www.ft.com/content/${uuid}`;
	}
};

module.exports.stream = (metadatum, options) => {
	const streamUrl = `http://www.ft.com/stream/${metadatum.taxonomy}Id/${metadatum.idV1}`;

	if(process.env.VERIFY_STREAM_URLS !== 'true') {
		return Promise.resolve(streamUrl);
	}

	const headers = {
		// Ensure we're opted-in to Next
		cookie: 'FT_SITE=NEXT',
	};

	return fetch(streamUrl, {headers, _wrappedFetchGroup: options._wrappedFetchGroup})
		.then(res => res.status === 200 && res.url)
		// Ignore errors
		.catch(() => null);
};
