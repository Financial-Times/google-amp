'use strict';
const articleXsltTransform = require('../../transforms/article-xslt');
const bodyTransform = require('../../transforms/body');
const dateTransform = require('../../transforms/date');
const summaryTransform = require('../../transforms/summary');

function transformArticleBody (article) {
	let xsltParams = {
		id: article.id,
		webUrl: article.webUrl,
		renderTOC: 0,
		suggestedRead: 0,
		useBrightcovePlayer: 0
	};

	return articleXsltTransform(article.bodyXML, 'main', xsltParams)
        .then(articleBody => {
            return bodyTransform(articleBody, {});
        });
}

module.exports = contentItem => {
    return new Promise ((resolve, reject) => {
        return transformArticleBody(contentItem)
            .then(transformedContent => {
                contentItem.htmlBody = transformedContent.bodyHtml;
                contentItem.mainImageHtml = transformedContent.mainImageHtml;
                contentItem.displayDate = dateTransform(contentItem);
                contentItem.displaySummary = summaryTransform(contentItem);
                console.log(contentItem);
                resolve(contentItem);
            })
            .catch(err => {
                reject(console.log(err));
            });    
    });
}