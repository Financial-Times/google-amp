'use strict';

const elasticSearchUrl = process.env.ELASTIC_SEARCH_URL;
const signedFetch = require('../fetch/wrap')(require('signed-aws-es-fetch'), {
	tag: 'getArticle',
});
const fetchres = require('fetchres');

const index = 'content';

module.exports = (uuid, options) => signedFetch(`https://${elasticSearchUrl}/${index}/item/${uuid}`, options)
	.then(res => Promise.resolve(res)
		.then(fetchres.json)
		.catch(err => {
			err.response = res;
			throw err;
		}));
