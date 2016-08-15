'use strict';
const cheerio = require('cheerio');

const replaceEllipses = require('./transforms/replace-ellipses');
const trimmedLinks = require('./transforms/trimmed-links');
const externalImages = require('./external-images');
const copyrightNotice = require('./transforms/copyright-notice');
const lightSignup = require('./transforms/light-signup');
const removeStyleAttributes = require('./transforms/remove-styles');
const replaceFtConceptTags = require('./transforms/ft-concept');
const insertAd = require('./transforms/insert-ad');

module.exports = function run(body, flags) {
	body = replaceEllipses(body);
	body = body.replace(/<\/a>\s+([,;.:])/mg, '</a>$1');
	body = body.concat(copyrightNotice());

	const $ = cheerio.load(body, {decodeEntities: false});

	return Promise.all([
		externalImages,
		trimmedLinks,
		removeStyleAttributes,
		insertAd,    // ← before light signup so light signup's positioning
		lightSignup, // logic ensures they don't conflict
		replaceFtConceptTags,
	].map(transform => transform($, flags)))
		.then(() => $);
};
