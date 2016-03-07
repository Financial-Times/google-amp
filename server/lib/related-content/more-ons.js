'use strict';
const api = require('next-ft-api-client');
const dateTransform = require('../article-date');
const sanitizeImage = require('../sanitize-image');
const moreOnCount = 5;
const getStreamUrl = require('../get-stream-url');

const addArticles = metadatum => api.search({
	filter: ['metadata.idV1', metadatum.idV1],

		// Fetch twice as many as we need, to allow for deduping
	count: moreOnCount * 2,
	fields: [
		'id',
		'title',
		'metadata',
		'summaries',
		'mainImage',
		'publishedDate',
	],
})
	.then(res => res.filter(article => article.title)
			.map(article => ({
				date: dateTransform(article.publishedDate, 'more-ons__date'),
				id: article.id,
				title: article.title,
				summary: Array.isArray(article.summaries) ? article.summaries[0] : null,
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

const addStreamUrl = metadatum => getStreamUrl(metadatum)
	// Ignore errors
	.catch(() => {})
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
	const moreOns = article.metadata.filter(metadatum => metadatum.primary);

	const promises = []
		.concat(moreOns.map(addStreamUrl))
		.concat(moreOns.map(addArticles));

	return Promise.all(promises)
		.then(() => {
			article.moreOns = moreOns
				.filter(moreOn => {
					if(moreOn.error) {
						if(options.raven) {
							options.raven.captureMessage('More-Ons API call failed', {
								level: 'error',
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
