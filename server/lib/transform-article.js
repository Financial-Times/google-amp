'use strict';

const dateTransform = require('./article-date');
const summaryTransform = require('./article-summary');
const schemaHeadlineTransform = require('./article-headline');
const extractMainImage = require('./transforms/extract-main-image');
const transformBody = require('./transform-body');

module.exports = (contentItem, options) => transformBody(contentItem.bodyXML, options)
	.then(transformed$ => {
		contentItem.mainImageHtml = extractMainImage(transformed$);
		contentItem.htmlBody = transformed$.html();
		contentItem.displayDate = dateTransform(contentItem.publishedDate, {classname: 'article-date'});
		contentItem.displaySummary = summaryTransform(contentItem);
		contentItem.schemaHeadline = schemaHeadlineTransform(contentItem);
		return contentItem;
	});
