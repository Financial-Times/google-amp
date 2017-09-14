'use strict';

const nEsClient = require('@financial-times/n-es-client');
const dateTransform = require('../transforms/extra/date');
const sanitizeImage = require('../sanitize-image');
const url = require('../url');

const moreOnCount = 5;

const addArticles = annotation => nEsClient.search({
	query: {term: {'annotations.id': annotation.id}},

	// Fetch twice as many as we need, to allow for deduping
	size: moreOnCount * 2,
	_source: [
		'id',
		'title',
		'metadata',
		'standfirst',
		'mainImage',
		'publishedDate',
	],
})
	.then(res => res.filter(article => article.title)
		.map(article => ({
			date: dateTransform(article.publishedDate, {classname: 'more-ons__date'}),
			id: article.id,
			url: url.external(article.id),
			title: article.title,
			summary: article.standfirst,
			image: sanitizeImage(article.mainImage),
		}))
	)
	.then(articles => Object.assign(annotation, {articles}))
	.catch(error => Object.assign(annotation, {error}));

const getMoreOnTags = content => {
	const moreOnTags = [];

	const about = content.annotations.find(
		annotation => annotation.predicate === 'http://www.ft.com/ontology/annotation/about'
	);
	const primarilyClassifiedBy = content.annotations.find(
		annotation => annotation.predicate === 'http://www.ft.com/ontology/classification/isPrimarilyClassifiedBy'
	);
	const brand = content.annotations.find(
		annotation => annotation.types && annotation.types.includes('http://www.ft.com/ontology/product/Brand')
	);

	if(about) {
		moreOnTags.push(about);
	}

	if(primarilyClassifiedBy) {
		moreOnTags.push(primarilyClassifiedBy);
	}

	if(brand && brand !== primarilyClassifiedBy) {
		moreOnTags.push(brand);
	}

	return moreOnTags.slice(0, 2);
};

module.exports = (article, options) => Promise.all(
	getMoreOnTags(article).map(addArticles)
).then(moreOns => {
	article.moreOns = moreOns
		.filter(moreOn => {
			if(moreOn.error) {
				if(options.raven) {
					options.raven.captureMessage('More-Ons API call failed', {
						level: 'warning',
						extra: {moreOn},
					});
				}
				return false;
			}
			return true;
		})
		.filter(moreOn => {
			moreOn.articles = moreOn.articles.filter(item => {
				if(options.relatedArticleDeduper.indexOf(item.id) >= 0) return false;

				options.relatedArticleDeduper.push(item.id);
				return true;
			})
			.slice(0, moreOnCount);
			return !!moreOn.articles.length;
		});
});
