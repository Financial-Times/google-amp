'use strict';
const elasticSearchUrl = process.env.ELASTIC_SEARCH_URL;
const signedFetch = require('signed-aws-es-fetch');
const index = 'v3_api_v2';

module.exports = uuid => {
    return new Promise ((resolve, reject) => {
        let esUrl = `https://${elasticSearchUrl}/${index}/item/${uuid}`;
        return signedFetch(esUrl)
            .then(response => {
                return response.json();
            })
            .then(apiReponse  => {
                resolve(apiReponse);
            })
            .catch(err => {
                reject(console.log(err));
            });    
    });
}