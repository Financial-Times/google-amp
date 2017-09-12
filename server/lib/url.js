'use strict';

const fetch = require('./fetch/wrap')(require('node-fetch'));
const fetchres = require('fetchres');
const url = require('url');

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
