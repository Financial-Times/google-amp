const getArticle = require('../lib/getArticle');
const getRelatedContent = require('../lib/getRelatedContent');
const renderArticle = require('../lib/render-article');
const transformArticle = require('../lib/transformEsV3Item.js');
const isFree = require('../lib/article-is-free');
const errors = require('http-errors');


module.exports = (req, res, next) => {
	const articlePromise = getArticle(req.params.uuid)
		.then(response => response._source ? transformArticle(response._source) : Promise.reject(new errors.NotFound()))
		.then(article => isFree(article, req) ? article : Promise.reject(new errors.NotFound()));

	const relatedPromise = getRelatedContent(req.params.uuid, req.raven);

	Promise.all([articlePromise, relatedPromise])
		.then((responses) => {

			// Destructuring would be nice
			let article = responses[0];
			let relatedContent = responses[1];

			article.relatedContent = relatedContent;
			return article;
		})
		.then(data => {
			data.SOURCE_PORT = (req.app.get('env') === 'production') ? '' : ':5000';
			return data;
		})
		.then(data => renderArticle(data, {
			precompiled: req.app.get('env') === 'production'
		}))
		.then(content => {
			res.setHeader('cache-control', 'public, max-age=30');
			res.send(content);
		})
		.catch(next);
};

