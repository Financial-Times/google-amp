'use strict';
const getArticle = require('../getArticle');
const dateTransform = require('../article-date');
const sanitizeImage = require('../sanitize-image');
const getStreamUrl = require('../get-stream-url');

const formatRelatedContent = (options, item) => {
	const primaryTheme = (item.metadata || []).filter(metadatum => !!metadatum.primary)[0];
	options._wrappedFetchGroup = `story-package-${item.id}`;

	return getStreamUrl(primaryTheme, options)
		// Ignore errors
		.catch(() => {})
		.then(streamUrl => ({
			date: dateTransform(item.publishedDate, 'related-content__date'),
			id: item.id,
			title: item.title,
			image: sanitizeImage(item.mainImage),
			summary: Array.isArray(item.summaries) ? item.summaries[0] : null,
			theme: {
				url: streamUrl,
				name: primaryTheme.prefLabel,
			},
		}));
};

module.exports = (article, options) => {
	const getRelated = (article.storyPackage || []).map(related => getArticle(related.id, {
		_wrappedFetchGroup: `story-package-${related.id}`,
	}));

	return Promise.all(getRelated)
		.catch(e => {
			if(options.raven) {
				options.raven.captureMessage('Story Package API call failed', {
					level: 'warning',
					extra: {e},
				});
			}

			throw e;
		})
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
};
