'use strict';
const cheerio = require('cheerio');

const replaceEllipses = require('./transforms/replace-ellipses');
const trimmedLinks = require('./transforms/trimmed-links');
const externalImages = require('./external-images');
const copyrightNotice = require('./transforms/copyright-notice');
const lightSignup = require('./transforms/light-signup');
const insertAd = require('./transforms/insert-ad');

function removeStyleAttributes($) {
	$('[style]').each(function eachStyle() {
		$(this).removeAttr('style');
	});

	return $;
}

module.exports = function run(body, options) {
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
	].map(transform => transform($, options)))
		.then(() => $);
};
