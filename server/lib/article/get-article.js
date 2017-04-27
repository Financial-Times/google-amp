'use strict';

const nEsClient = require('@financial-times/n-es-client');

module.exports = require('../fetch/wrap')(
	(uuid, options) => nEsClient.get(uuid, options),
	{
		tag: 'getArticle',
		userAgent: false,
	}
);
