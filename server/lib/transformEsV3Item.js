const articleXsltTransform = require('../../next-article/server/transforms/article-xslt');
const bodyTransform = require('../../next-article/server/transforms/body');
const dateTransform = require('./article-date');
const summaryTransform = require('./article-summary');
const cheerio = require('cheerio');

function cheerioTransforms(transforms) {
	return function(article) {
		article.bodyHtml = transforms.reduce(
			($, transform) => (transform($) || $),
			cheerio.load(article.bodyHtml)
		).html();
		return article;
	};
}

function removeStyleAttributes($) {
	$('[style]').each(function() {
		$(this).removeAttr('style');
	});
}

function transformArticleBody(article) {
	let xsltParams = {
		id: article.id,
		webUrl: article.webUrl,
		renderTOC: 0,
		suggestedRead: 0,
		useBrightcovePlayer: 0
	};

	return articleXsltTransform(article.bodyXML, 'main', xsltParams)
		.then(articleBody => bodyTransform(articleBody, {}))
		.then(cheerioTransforms([removeStyleAttributes]));
}

module.exports = contentItem => transformArticleBody(contentItem)
	.then(transformedContent => {
		contentItem.htmlBody = transformedContent.bodyHtml;
		contentItem.mainImageHtml = transformedContent.mainImageHtml;
		contentItem.displayDate = dateTransform(contentItem);
		contentItem.displaySummary = summaryTransform(contentItem);
		return contentItem;
	});
