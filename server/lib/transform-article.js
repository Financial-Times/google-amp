'use strict';
const articleXsltTransform = require('./article-xslt');
const cheerioTransform = require('./cheerio-transform');
const dateTransform = require('./article-date');
const summaryTransform = require('./article-summary');
const schemaHeadlineTransform = require('./article-headline');
const extractMainImage = require('./transforms/extract-main-image');

function transformArticleBody(article, options) {
	const xsltParams = {
		id: article.id,
		webUrl: article.webUrl,
		renderTOC: 0,
		suggestedRead: 0,
		brightcoveAccountId: process.env.BRIGHTCOVE_ACCOUNT_ID,

		// See: https://github.com/ampproject/amphtml/blob/master/extensions
		// /amp-brightcove/amp-brightcove.md#player-configuration
		// NB: Next don't use the native Brightcove player, so don't use this param.
		// Default seems fine.
		// brightcovePlayerId: process.env.BRIGHTCOVE_PLAYER_ID
		brightcovePlayerId: 'default',
	};

	return articleXsltTransform(article.bodyXML, 'main', xsltParams)
		.then(articleBody => cheerioTransform(articleBody, options));
}

module.exports = (contentItem, options) => transformArticleBody(contentItem, options)
	.then(transformed$ => {
		contentItem.mainImageHtml = extractMainImage(transformed$);
		contentItem.htmlBody = transformed$.html();
		contentItem.displayDate = dateTransform(contentItem.publishedDate, 'article-date');
		contentItem.displaySummary = summaryTransform(contentItem);
		contentItem.schemaHeadline = schemaHeadlineTransform(contentItem);
		return contentItem;
	});
