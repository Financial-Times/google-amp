'use strict';

const cheerioTransform = require('./cheerio-transform');
const articleXsltTransform = require('./article-xslt');

module.exports = (body, options = {}) => {
	const xsltParams = Object.assign({
		renderTOC: 0,
		brightcoveAccountId: process.env.BRIGHTCOVE_ACCOUNT_ID,

		// See: https://github.com/ampproject/amphtml/blob/master/extensions
		// /amp-brightcove/amp-brightcove.md#player-configuration
		// NB: Next don't use the native Brightcove player, so don't use this param.
		// Default seems fine.
		// brightcovePlayerId: process.env.BRIGHTCOVE_PLAYER_ID
		brightcovePlayerId: 'default',
	}, options.xslt);

	return articleXsltTransform(body, 'main', xsltParams)
		.then(articleBody => cheerioTransform(articleBody, options));
};
