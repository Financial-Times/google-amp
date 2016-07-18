'use strict';
const getArticle = require('../lib/get-article');
const addStoryPackage = require('../lib/related-content/story-package');
const addMoreOns = require('../lib/related-content/more-ons');
const addPrimaryTheme = require('../lib/primary-theme');
const renderArticle = require('../lib/render-article');
const transformArticle = require('../lib/transform-article');
const fetchSlideshows = require('../lib/fetch-slideshows');
const transformSlideshows = require('../lib/transform-slideshows');
const errors = require('http-errors');
const fetchres = require('fetchres');

const liveAccessHost = 'amp-access-svc.memb.ft.com';
const lightSignupProduct = 'Google AMP';
const lightSignupMailinglist = 'google-amp';

function getAndRender(uuid, options) {
	return getArticle(uuid)
		.then(
			response => response._source ? response._source : Promise.reject(new errors.NotFound()),
			err => (
				console.log(err),
				Promise.reject(err.name === fetchres.BadServerResponseError.name ? new errors.NotFound() : err)
			)
		)

		// First phase: network-dependent fetches and transforms in parallel
		.then(article => Promise.all(
			[
				transformArticle(article, options),
				addStoryPackage(article, options),
				addMoreOns(article, options),
				addPrimaryTheme(article, options),
				fetchSlideshows(article, options),
			])

			// Second phase: transforms which rely on first phase fetches
			.then(() => Promise.all([
				transformSlideshows(article, options),
			])

			// Return the article
			.then(() => article))
		)
		.then(article => {
			article.AUTH_AUTHORIZATION_URL = options.accessMock ?
				`//${options.host}/amp-access-mock?type=access&` :
				`https://${liveAccessHost}/amp-access?`;

			article.AUTH_PINGBACK_URL = options.accessMock ?
				`//${options.host}/amp-access-mock?type=pingback&` :
				`https://${liveAccessHost}/amp-pingback?`;

			article.AUTH_LOGIN_URL = options.accessMock ?
				`//${options.host}/amp-access-mock?type=login&` :
				'https://accounts.ft.com/login?';

			article.AUTH_LOGOUT_URL = options.accessMock ?
				`//${options.host}/amp-access-mock?type=logout&` :
				`https://${liveAccessHost}/amp-logout?`;

			article.SOURCE_PORT = options.production ? '' : ':5000';

			article.freeArticle = !!options.alwaysFree;
			article.accessMocked = !!options.accessMock;
			return article;
		})
		.then(article => renderArticle(article, options));
}

module.exports = (req, res, next) => {
	getAndRender(req.params.uuid, {
		production: req.app.get('env') === 'production',
		raven: req.raven,
		host: req.get('host'),
		ip: req.ip,
		ua: req.get('User-Agent'),
		relatedArticleDeduper: [req.params.uuid],
		accessMock: req.cookies.amp_access_mock,
		lightSignupUrl: process.env.LIGHT_SIGNUP_URL || 'https://distro-light-signup-prod.herokuapp.com',
		lightSignupProduct: encodeURIComponent(lightSignupProduct),
		lightSignupMailinglist: encodeURIComponent(lightSignupMailinglist),
		enableLightSignup: (process.env.ENABLE_LIGHT_SIGNUP === 'true'),
		uuid: req.params.uuid,
	})
		.then(content => {
			res.setHeader('cache-control', 'public, max-age=30, no-transform');
			res.send(content);
		})
		.catch(next);
};

module.exports.getAndRender = getAndRender;

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
