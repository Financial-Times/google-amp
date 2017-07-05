'use strict';

const fetch = require('./fetch/wrap')(require('node-fetch'));
const fetchres = require('fetchres');
const url = require('url');

// Make use of cache layer in front of ES
// See: https://github.com/Financial-Times/next-es-interface/blob/master/server/app.js#L73-L82
// Currently lacking documentation!
const thingsUrl = 'http://next-es-interface.ft.com/things?authority=http://api.ft.com/system/FT-TME';
const thingsUrlObj = url.parse(thingsUrl, true);
delete thingsUrlObj.search;

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

// HACK:MB:20170705 magic url from Tyrone that amp-access-svc understands
module.exports.accessCheck = article => `https://api.ft.com/content/${article.id}`;

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

module.exports.stream = metadatum => {
	const esUrl = Object.assign({}, thingsUrlObj);
	esUrl.query = Object.assign({}, esUrl.query, {
		identifierValue: metadatum.idV1,
	});

	return fetch(url.format(esUrl))
		.then(fetchres.json)
		.then(json => json.term.url)
		// Ignore errors
		.catch(() => null);
};
