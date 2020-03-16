'use strict';

const nEsClient = require('@financial-times/n-es-client');
const dateTransform = require('../transforms/extra/date');
const sanitizeImage = require('../sanitize-image');
const url = require('../url');

const formatRelatedContent = (options, item) => ({
	date: dateTransform(item.publishedDate, {classname: 'related-content__date'}),
	id: item.id,
	url: url.external(item.id),
	title: item.title,
	image: sanitizeImage(item.mainImage),
	summary: item.standfirst,
	theme: {
		url: item.displayConcept.url,
		prefLabel: item.displayConcept.prefLabel,
	},
});

const getRelated = (id, options) => nEsClient.get(id).catch(e => {
	// Ignore 404 errors, for content not in ElasticSearch
	if(e.status === 404) {
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

module.exports = (article, options) => Promise.all(
	(article.curatedRelatedContent || article.storyPackage || [])
		.map(related => getRelated(related.id, options))
)
	.then(related => related.filter(response => response))
	.then(related => {
		related.forEach(item => {
			options.relatedArticleDeduper.push(item.id);
		});
		return Promise.all(related.map(formatRelatedContent.bind(null, options)));
	})
	.then(relatedContent => Object.assign(article, {relatedContent}))
	.catch(() => {});
