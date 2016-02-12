const elasticSearchUrl = process.env.ELASTIC_SEARCH_URL;
const signedFetch = require('signed-aws-es-fetch');
const index = 'v3_api_v2';

module.exports = uuid => signedFetch(`https://${elasticSearchUrl}/${index}/item/${uuid}`)
	.then(response => response.json());
