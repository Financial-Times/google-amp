'use strict';
const fetchHead = require('./wrap-fetch.js')(require('@quarterto/fetch-head'), {
	tag: 'get-stream-url',
});

module.exports = (metadatum, options) => {
	const streamUrl = `http://www.ft.com/stream/${metadatum.taxonomy}Id/${metadatum.idV1}`;
	const headers = {};

	// Set User-Agent (to avoid Akamai blocking the request), and client IP
	// to avoid rate-limiting by IP.
	if(options.ua) headers['user-agent'] = options.ua;
	if(options.ip) {
		headers['x-forwarded-for'] = options.ip;
		headers['true-client-ip'] = options.ip;
	}

	return fetchHead(streamUrl, {headers, _wrappedFetchGroup: options._wrappedFetchGroup})
		.then(res => res.status >= 200 && res.status < 400 && streamUrl);
};
