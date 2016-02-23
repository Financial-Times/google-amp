const getItem = require('../lib/getItem');
const renderArticle = require('../lib/render-article');
const transformArticle = require('../lib/transformEsV3Item.js');
const isFree = require('../lib/article-is-free');
const errors = require('http-errors');

const mockAccessAuthentication = true;

module.exports = (req, res, next) => {
	getItem(req.params.uuid)
		.then(apiResponse => apiResponse._source ? transformArticle(apiResponse._source) : Promise.reject(new errors.NotFound()))
		.then(article => isFree(article, req) ? article : Promise.reject(new errors.NotFound()))
		.then(data => {
			const useMock = (req.app.get('env') === 'production') || mockAccessAuthentication;

			data.AUTH_AUTHORIZATION_URL = useMock ? `//${req.get('host')}/amp-access-mock?type=access&` : 'https://amp-access-svc.memb.ft.com/amp-access?';
			data.AUTH_PINGBACK_URL      = useMock ? `//${req.get('host')}/amp-access-mock?type=pingback&` : 'https://amp-access-svc.memb.ft.com/amp-pingback?';
			data.AUTH_LOGIN_URL         = useMock ? `//${req.get('host')}/amp-access-mock?type=login&` : 'https://accounts.ft.com/login?';
			data.SOURCE_PORT            = (req.app.get('env') === 'production') ? '' : ':5000';

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
