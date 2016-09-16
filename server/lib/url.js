'use strict';

const fetch = require('./wrap-fetch')(require('node-fetch'), {
	tag: 'url',
});

const fetchres = require('fetchres');
const pkg = require('../../package.json');

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
	// Make use of cache layer in front of ES
	// See: https://github.com/Financial-Times/next-es-interface/blob/master/server/app.js#L73-L82
	// Currently lacking documentation!
	const url = 'http://next-es-interface.ft.com/things?authority=http://api.ft.com/system/FT-TME' +
		`&identifierValue=${metadatum.idV1}`;

	return fetch(url, {
		headers: {
			'user-agent': `ft-google-amp v${pkg.version}`,
		},
		_wrappedFetchGroup: options._wrappedFetchGroup,
	})
		.then(fetchres.json)
		.then(json => json.term.url)
		// Ignore errors
		.catch(() => null);
};
