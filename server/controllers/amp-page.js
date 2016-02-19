const getItem = require('../lib/getItem');
const renderArticle = require('../lib/render-article');
const transformArticle = require('../lib/transformEsV3Item.js');
const isFree = require('../lib/article-is-free');
const errors = require('http-errors');


module.exports = (req, res, next) => {
	getItem(req.params.uuid)
		.then(apiResponse => apiResponse._source ? transformArticle(apiResponse._source) : Promise.reject(new errors.NotFound()))
		.then(article => isFree(article, req) ? article : Promise.reject(new errors.NotFound()))
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

