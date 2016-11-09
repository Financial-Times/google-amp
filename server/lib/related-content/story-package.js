'use strict';
const getArticle = require('../get-article');
const dateTransform = require('../article-date');
const sanitizeImage = require('../sanitize-image');
const url = require('../url');

const formatRelatedContent = (options, item) => {
	const primaryTheme = (item.metadata || []).filter(metadatum => !!metadatum.primary)[0];
	options._wrappedFetchGroup = `story-package-${item.id}`;

	return url.stream(primaryTheme, options)
		.then(streamUrl => ({
			date: dateTransform(item.publishedDate, {classname: 'related-content__date'}),
			id: item.id,
			url: url.external(item.id),
			title: item.title,
			image: sanitizeImage(item.mainImage),
			summary: Array.isArray(item.summaries) ? item.summaries[0] : null,
			theme: {
				url: streamUrl,
				name: primaryTheme.prefLabel,
			},
		}));
};

const getRelated = (id, options) => getArticle(id, {
	_wrappedFetchGroup: `story-package-${id}`,
})
.catch(e => {
	// Ignore 404 errors, for content not in ElasticSearch
	if(e.message === 404) {
		return;
	}

	if(options.raven) {
		options.raven.captureMessage('Story Package API call failed', {
			level: 'warning',
			extra: {e},
		});
	}

	throw e;
});

module.exports = (article, options) =>
	Promise.all((article.storyPackage || []).map(related => getRelated(related.id, options)))
	.then(related => related.filter(response => response))
	.then(related => related.map(response => response._source ? response._source : Promise.reject()))
	.then(related => {
		related.forEach(item => {
			options.relatedArticleDeduper.push(item.id);
		});

		return Promise.all(related.map(formatRelatedContent.bind(null, options)));
	})
	.then(related => {
		article.relatedContent = related;
		return article;
	})
	.catch(() => {});
