const articleXsltTransform = require('../../next-article/server/transforms/article-xslt');
const bodyTransform = require('../../next-article/server/transforms/body');
const dateTransform = require('./article-date');
const summaryTransform = require('./article-summary');

function transformArticleBody (article) {
	let xsltParams = {
		id: article.id,
		webUrl: article.webUrl,
		renderTOC: 0,
		suggestedRead: 0,
		useBrightcovePlayer: 0
	};

	return articleXsltTransform(article.bodyXML, 'main', xsltParams)
		.then(articleBody => bodyTransform(articleBody, {}));
}

module.exports = contentItem => transformArticleBody(contentItem)
	.then(transformedContent => {
		contentItem.htmlBody = transformedContent.bodyHtml;
		contentItem.mainImageHtml = transformedContent.mainImageHtml;
		contentItem.displayDate = dateTransform(contentItem);
		contentItem.displaySummary = summaryTransform(contentItem);
		console.log(contentItem);
		return contentItem;
	});
