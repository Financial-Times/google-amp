'use strict';

const nEsClient = require('@financial-times/n-es-client');
const dateTransform = require('../transforms/extra/date');
const sanitizeImage = require('../sanitize-image');
const url = require('../url');

const moreOnCount = 5;

const addArticles = metadatum => nEsClient.search({
	query: {term: {'metadata.idV1': metadatum.idV1}},

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
	.then(articles => {
		metadatum.articles = articles;
	})
	// Ignore errors
	.catch(e => {
		metadatum.error = e;
	});

const addStreamUrl = (options, metadatum) => url.stream(metadatum, options)
	.then(streamUrl => {
		metadatum.streamUrl = streamUrl;
	});

const processMetadata = metadatum => {
	let type;

	switch(metadatum.taxonomy) {
		case 'authors':
			type = 'from';
			break;
		case 'sections':
			type = 'in';
			break;
		case 'genre':
			type = '';
			break;
		default:
			type = 'on';
	}

	return {
		articles: metadatum.articles,
		key: metadatum.idV1,
		taxonomy: metadatum.taxonomy,
		theme: {
			url: metadatum.streamUrl,
			type: `Latest ${type}`,
			name: metadatum.prefLabel,
		},
	};
};

module.exports = (article, options) => {
	// Filter only the metadata with a primary taxonomy
	const moreOns = (article.metadata || []).filter(metadatum => metadatum.primary);

	const promises = []
		.concat(moreOns.map(addStreamUrl.bind(null, options)))
		.concat(moreOns.map(addArticles));

	return Promise.all(promises)
		.then(() => {
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
				})
				.map(processMetadata);
		});
};
