'use strict';

const dateTransform = require('./article-date');
const summaryTransform = require('./article-summary');
const schemaHeadlineTransform = require('./article-headline');
const extractMainImage = require('./transforms/extract-main-image');
const transformBody = require('./transform-body');
const cheerio = require('cheerio');

module.exports = (contentItem, options) => transformBody(contentItem.bodyHTML, options)
	.then(transformedBody => {
		contentItem.mainImageHtml = extractMainImage(cheerio.load(transformedBody), {decodeEntities: false});
		contentItem.htmlBody = transformedBody;
		contentItem.displayDate = dateTransform(contentItem.publishedDate, {classname: 'article-date'});
		contentItem.displaySummary = summaryTransform(contentItem);
		contentItem.schemaHeadline = schemaHeadlineTransform(contentItem);
		return contentItem;
	});
