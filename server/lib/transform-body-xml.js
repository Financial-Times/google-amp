'use strict';

const cheerio = require('cheerio');

const replaceEllipses = require('./xml-transforms/replace-ellipses');
const trimmedLinks = require('./xml-transforms/trimmed-links');
const externalImages = require('./xml-transforms/external-images');
const fixEmoticons = require('./xml-transforms/fix-emoticons');
const lightSignup = require('./xml-transforms/light-signup');
const removeStyleAttributes = require('./xml-transforms/remove-styles');
const replaceFtConceptTags = require('./xml-transforms/ft-concept');
const insertAd = require('./xml-transforms/insert-ad');
const linkAnalytics = require('./xml-transforms/link-analytics');
const removeInvalidLinks = require('./xml-transforms/remove-invalid-links');

const articleXsltTransform = require('./article-xslt');

const cheerioTransform = (body, options) => {
	body = replaceEllipses(body);
	body = body.replace(/<\/a>\s+([,;.:])/mg, '</a>$1');

	const $ = cheerio.load(body, {decodeEntities: false});

	return Promise.all([
		fixEmoticons,
		externalImages,
		trimmedLinks,
		removeStyleAttributes,
		insertAd,
		lightSignup,
		replaceFtConceptTags,
		linkAnalytics,
		removeInvalidLinks,
	].map(transform => transform($, options)))
		.then(() => $.html());
};


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
