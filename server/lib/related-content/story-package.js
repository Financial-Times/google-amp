const getArticle = require('../getArticle');
const dateTransform = require('../article-date');

module.exports = article => {
	const getRelated = (article.storyPackage || []).map(related => getArticle(related.id));

	return Promise.all(getRelated)
		.catch(e => {

			// TODO: Sentry
			console.log(e.message)// @nocommit
			return [];
		})
		.then(related => related.map(response => response._source ? response._source : Promise.reject()))
		.then(related => {
			article.relatedContent = related.map(item => {
				return {
					date: dateTransform(item.publishedDate, 'related-content__date'),
					id: item.id,
					title: item.title
				};
			});
			return article;
		});
};