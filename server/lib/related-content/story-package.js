const getArticle = require('../getArticle');
const dateTransform = require('../article-date');
const sanitizeImage = require('../sanitize-image');

module.exports = (article, options) => {
	const getRelated = (article.storyPackage || []).map(related => getArticle(related.id));
	return Promise.all(getRelated)
		.catch(e => {
			if(options.raven) {
				options.raven.captureMessage('Story Package API call failed', {
					level: 'error',
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

			article.relatedContent = related.map(item => ({
				date: dateTransform(item.publishedDate, 'related-content__date'),
				id: item.id,
				title: item.title,
				image: sanitizeImage(item.mainImage),
				summary: Array.isArray(item.summaries) ? item.summaries[0] : null,
				theme: item.metadata.reduce(
					(previous, current) => previous || (current.primary && current.prefLabel),
					null
				),
			}));

			return article;
		})
		.catch(() => {});
};
