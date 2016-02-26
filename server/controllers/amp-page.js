const getArticle = require('../lib/getArticle');
const addStoryPackage = require('../lib/related-content/story-package');
const addMoreOns = require('../lib/related-content/more-ons');
const renderArticle = require('../lib/render-article');
const transformArticle = require('../lib/transformEsV3Item.js');
const errors = require('http-errors');

const mockAccessAuthentication = false;
const liveAccessHost = 'amp-access-svc.memb.ft.com';

function getAndRender(uuid, options) {
	return getArticle(uuid)
		.then(response => response._source ?
			transformArticle(response._source, options) :
			Promise.reject(new errors.NotFound())
		)
		.then(article => Promise.all([
			addStoryPackage(article, options),
			addMoreOns(article, options),
		]).then(() => article))
		.then(data => {
			data.AUTH_AUTHORIZATION_URL = mockAccessAuthentication ?
				`//${options.host}/amp-access-mock?type=access&` :
				`https://${liveAccessHost}/amp-access?`;

			data.AUTH_PINGBACK_URL = mockAccessAuthentication ?
				`//${options.host}/amp-access-mock?type=pingback&` :
				`https://${liveAccessHost}/amp-pingback?`;

			data.AUTH_LOGIN_URL = mockAccessAuthentication ?
				`//${options.host}/amp-access-mock?type=login&` :
				'https://accounts.ft.com/login?';

			data.AUTH_LOGOUT_URL = mockAccessAuthentication ?
				`//${options.host}/amp-access-mock?type=logout&` :
				`https://${liveAccessHost}/amp-logout?`;

			data.SOURCE_PORT = options.production ? '' : ':5000';

			data.freeArticle = !!options.alwaysFree;
			return data;
		})
		.then(data => renderArticle(data, {precompiled: options.production}));
}

module.exports = (req, res, next) => {
	getAndRender(req.params.uuid, {
		production: req.app.get('env') === 'production',
		raven: req.raven,
		host: req.get('host'),
		relatedArticleDeduper: [req.params.uuid],
	})
		.then(content => {
			res.setHeader('cache-control', 'public, max-age=30');
			res.send(content);
		})
		.catch(next);
};

if(module === require.main) {
	getAndRender(process.argv[2], {
		production: false,
		alwaysFree: true,
		relatedArticleDeduper: [process.argv[2]],
	}).then(
		rendered => process.stdout.write(rendered),
		err => {
			console.error(err.stack || err.toString());
			process.exit(1);
		}
	);
}
