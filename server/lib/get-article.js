'use strict';
const elasticSearchUrl = process.env.ELASTIC_SEARCH_URL;
const signedFetch = require('./wrap-fetch')(require('signed-aws-es-fetch'), {
	tag: 'getArticle',
});
const fetchres = require('fetchres');

const index = 'v3_api_v2';

module.exports = (uuid, options) => signedFetch(`https://${elasticSearchUrl}/${index}/item/${uuid}`, options)
	.then(fetchres.json);
