const getItem = require('../lib/getItem');
const renderArticle = require('../lib/render-article');
const transformArticle = require('../lib/transformEsV3Item.js');
const errors = require('http-errors');

var isFree = article => /^http:\/\/www.ft.com\/cms\/s\/2/.test(article.webUrl);

module.exports = (req, res, next) => {
	getItem(req.params.uuid)
		.then(apiResponse => apiResponse._source ? transformArticle(apiResponse._source) : Promise.reject(new errors.InternalServerError(apiResponse.message)))
		.then(article => (isFree(article) || req.app.get('env') === 'development') ? article : Promise.reject(new errors.NotFound()))
		.then(data => renderArticle(data, {
			precompiled: req.app.get('env') === 'production'
		}))
		.then(content => {
			res.setHeader('cache-control', 'public, max-age=30');
			res.send(content);
		})
		.catch(next);
};

