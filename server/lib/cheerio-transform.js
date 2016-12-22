'use strict';

const cheerio = require('cheerio');

const replaceEllipses = require('./transforms/replace-ellipses');
const trimmedLinks = require('./transforms/trimmed-links');
const externalImages = require('./transforms/external-images');
const fixEmoticons = require('./transforms/fix-emoticons');
const copyrightNotice = require('./transforms/copyright-notice');
const lightSignup = require('./transforms/light-signup');
const removeStyleAttributes = require('./transforms/remove-styles');
const replaceFtConceptTags = require('./transforms/ft-concept');
const insertAd = require('./transforms/insert-ad');
const linkAnalytics = require('./transforms/link-analytics');
const removeInvalidLinks = require('./transforms/remove-invalid-links');

module.exports = function run(body, flags) {
	body = replaceEllipses(body);
	body = body.replace(/<\/a>\s+([,;.:])/mg, '</a>$1');
	body = body.concat(copyrightNotice());

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
	].map(transform => transform($, flags)))
		.then(() => $);
};
