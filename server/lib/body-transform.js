'use strict';
const cheerio = require('cheerio');

const replaceEllipses = require('./transforms/replace-ellipses');
const trimmedLinks = require('../../bower_components/next-article/server/transforms/trimmed-links');
const externalImages = require('./external-images');
const copyrightNotice = require('./transforms/copyright-notice');
const extractMainImageAndToc =
	require('../../bower_components/next-article/server/transforms/extract-main-image-and-toc');

module.exports = function run(body, flags) {
	body = replaceEllipses(body);
	body = body.replace(/<\/a>\s+([,;.:])/mg, '</a>$1');
	body = body.replace(/http:\/\/www\.ft\.com\/ig\//g, '/ig/');
	body = body.replace(/http:\/\/ig\.ft\.com\//g, '/ig/');
	body = body.concat(copyrightNotice());

	const transformed$ = [
		externalImages,
		trimmedLinks,
	].reduce(
		(promise$, transform) => promise$.then($ => transform($, flags)),
		Promise.resolve(cheerio.load(body, {decodeEntities: false}))
	);

	return transformed$.then(extractMainImageAndToc);
};
