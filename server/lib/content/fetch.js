'use strict';

const errors = require('http-errors');
const nEsClient = require('@financial-times/n-es-client');

module.exports = ({type}) => uuid => nEsClient.get(uuid)
	.then(
		response => {
			if(response &&
				(!response.originatingParty || response.originatingParty === 'FT') &&
				(!response.type || response.type === type)
			) {
				return response;
			}

			throw new errors.NotFound(`Article ${uuid} not found`);
		},
		err => {
			if(err.status === 404) {
				throw new errors.NotFound(`Article ${uuid} not found`);
			}

			throw err;
		}
	);
