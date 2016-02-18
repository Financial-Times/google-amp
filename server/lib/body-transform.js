"use strict";

const cheerio = require('cheerio');

const replaceEllipses = require('../../bower_components/next-article/server/transforms/replace-ellipses');
const trimmedLinks = require('../../bower_components/next-article/server/transforms/trimmed-links');
const externalImages = require('../../bower_components/next-article/server/transforms/external-images');
const copyrightNotice = require('./transforms/copyright-notice');
const extractMainImageAndToc = require('../../bower_components/next-article/server/transforms/extract-main-image-and-toc');

let transform = function ($, flags) {
	let withFn = function ($, transformFn) {
		let transformed$ = transformFn($, flags);
		return {
			'with': withFn.bind(withFn, transformed$),
			get: function () {
				return transformed$;
			}
		};
	};
	return {
		'with': withFn.bind(withFn, $)
	};
};

module.exports = function (body, flags) {
	body = replaceEllipses(body);
	body = body.replace(/<\/a>\s+([,;.:])/mg, '</a>$1');
	body = body.replace(/http:\/\/www\.ft\.com\/ig\//g, '/ig/');
	body = body.replace(/http:\/\/ig\.ft\.com\//g, '/ig/');
	body = body.concat(copyrightNotice());

	let $ = transform(cheerio.load(body, { decodeEntities: false }), flags)
		// other transforms
		.with(externalImages)
		.with(trimmedLinks)
		.get();

	return extractMainImageAndToc($);
};
