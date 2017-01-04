'use strict';

const cheerio = require('cheerio');

const replaceEllipses = require('./xml-transforms/replace-ellipses');
const trimmedLinks = require('./xml-transforms/trimmed-links');
const externalImages = require('./xml-transforms/external-images');
const fixEmoticons = require('./xml-transforms/fix-emoticons');
const lightSignup = require('./xml-transforms/light-signup');
const removeStyleAttributes = require('./xml-transforms/remove-styles');
const replaceTagsWithContent = require('./xml-transforms/replace-tags-with-content');
const insertAd = require('./xml-transforms/insert-ad');
const linkAnalytics = require('./xml-transforms/link-analytics');
const removeInvalidLinks = require('./xml-transforms/remove-invalid-links');
const blockquotes = require('./xml-transforms/blockquotes');
const interactiveGraphics = require('./xml-transforms/interactive-graphics');
const contentLinks = require('./xml-transforms/content-links');
const video = require('./xml-transforms/video');

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
		blockquotes,
		replaceTagsWithContent,
		video,
		interactiveGraphics,
		contentLinks,
		linkAnalytics,
		removeInvalidLinks,
	].map(transform => transform($, options)))
		.then(() => $.html());
};

module.exports = (body, {brightcoveAccountId = process.env.BRIGHTCOVE_ACCOUNT_ID, brightcovePlayerId = 'default'} = {}) => {
	return articleXsltTransform(body)
		.then(articleBody => cheerioTransform(articleBody, {brightcovePlayerId, brightcoveAccountId}));
};
