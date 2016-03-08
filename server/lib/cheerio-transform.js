'use strict';
const cheerio = require('cheerio');

const replaceEllipses = require('./transforms/replace-ellipses');
const trimmedLinks = require('../../bower_components/next-article/server/transforms/trimmed-links');
const externalImages = require('./external-images');
const copyrightNotice = require('./transforms/copyright-notice');

function removeStyleAttributes($) {
	$('[style]').each(function eachStyle() {
		$(this).removeAttr('style');
	});

	return $;
}

module.exports = function run(body, flags) {
	body = replaceEllipses(body);
	body = body.replace(/<\/a>\s+([,;.:])/mg, '</a>$1');
	body = body.concat(copyrightNotice());

	const $ = cheerio.load(body, {decodeEntities: false});

	return Promise.all([
		externalImages,
		trimmedLinks,
		removeStyleAttributes,
	].map(transform => transform($, flags)))
		.then(() => $);
};
