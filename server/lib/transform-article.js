'use strict';

const dateTransform = require('./article-date');
const summaryTransform = require('./article-summary');
const schemaHeadlineTransform = require('./article-headline');
const extractMainImage = require('./xml-transforms/extract-main-image');
const transformBody = require('./transform-body-xml');
const cheerio = require('cheerio');

module.exports = (contentItem, options) => transformBody(contentItem.bodyHTML, options)
	.then(transformedBody => {
		const $ = cheerio.load(transformedBody, {decodeEntities: false});
		contentItem.mainImageHtml = extractMainImage($);
		return $.html();
	})
	.then(transformedBody => {
		contentItem.htmlBody = transformedBody;
		contentItem.displayDate = dateTransform(contentItem.publishedDate, {classname: 'article-date'});
		contentItem.displaySummary = summaryTransform(contentItem);
		contentItem.schemaHeadline = schemaHeadlineTransform(contentItem);
		return contentItem;
	});
