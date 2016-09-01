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
const querystring = require('querystring');
const fs = require('fs-promise');

const liveAccessHost = 'amp-access-svc.memb.ft.com';
const lightSignupProduct = 'AMP';
const lightSignupMailinglist = 'google-amp';
const segmentId = 'acee4131-99c2-09d3-a635-873e61754ec6';

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
			article.SOURCE_PORT = options.production ? '' : ':5000';

			article.AUTH_AUTHORIZATION_URL = options.accessMocked ?
				`//${options.host}/amp-access-mock?type=access&` :
				`https://${liveAccessHost}/amp-access?`;

			article.AUTH_PINGBACK_URL = options.accessMocked ?
				`//${options.host}/amp-access-mock?type=pingback&` :
				`https://${liveAccessHost}/amp-pingback?`;

			article.AUTH_LOGIN_URL = options.accessMocked ?
				`//${options.host}/amp-access-mock?type=login&` :
				'https://accounts.ft.com/login?';

			article.AUTH_LOGOUT_URL = options.accessMocked ?
				`//${options.host}/amp-access-mock?type=logout&` :
				`https://${liveAccessHost}/amp-logout?`;

			const thirdPartyHost = process.env.HEROKU_APP_NAME ?
				`${process.env.HEROKU_APP_NAME}.herokuapp.com` :
				'localhost:5000';

			article.KRUX_REMOTE = `//${thirdPartyHost}/ads-iframe/${uuid}`;

			article.freeArticle = !!options.alwaysFree;
			article.enableSidebarMenu = !!options.enableSidebarMenu;
			article.enableSocialShare = !!options.enableSocialShare;

			article.accessMocked = !!options.accessMocked;
			article.accessMockLoggedIn = !!options.accessMockLoggedIn;
			article.accessMockFcf = !!options.accessMockFcf;
			article.accessMockPreventAccess = !!options.accessMockPreventAccess;

			article.nextUrl = `https://next.ft.com/content/${uuid}`;

			const shareParams = {
				segmentid: segmentId,
			};
			article.shareUrl = `${article.webUrl}?${querystring.stringify(shareParams)}`;
			article.facebookAppId = '328135857526360';

			return article;
		})
		.then(article => renderArticle(article, options));
}

module.exports = (req, res, next) => {
	getAndRender(req.params.uuid, {
		production: req.app.isServer,
		raven: req.raven,
		host: req.get('host'),
		ip: req.ip,
		ua: req.get('User-Agent'),
		relatedArticleDeduper: [req.params.uuid],
		accessMocked: req.cookies['amp-access-mock'],
		accessMockLoggedIn: req.cookies['amp-access-mock-logged-in'],
		accessMockFcf: req.cookies['amp-access-mock-fcf'],
		accessMockPreventAccess: req.cookies['amp-access-mock-no-access'],
		lightSignupUrl: process.env.LIGHT_SIGNUP_URL || 'https://distro-light-signup-prod.herokuapp.com',
		lightSignupProduct: encodeURIComponent(lightSignupProduct),
		lightSignupMailinglist: encodeURIComponent(lightSignupMailinglist),
		enableLightSignup: (process.env.ENABLE_LIGHT_SIGNUP === 'true'),
		enableSidebarMenu: (process.env.ENABLE_SIDEBAR_MENU === 'true'),
		enableSocialShare: (process.env.ENABLE_SOCIAL_SHARE === 'true'),
		enableAds: (process.env.ENABLE_ADS === 'true'),
		uuid: req.params.uuid,
	})
		.then(content => {
			if(req.cookies['amp-access-mock']) {
				// No caching, to allow access mock cookies to be applied immediately
				res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
			} else {
				res.setHeader('cache-control', 'public, max-age=30, no-transform');
				res.setHeader('surrogate-control', 'stale-on-error=86400, stale-while-revalidate=86400');
			}

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
		rendered => fs.writeFile(process.argv[3], rendered),
		err => {
			console.error(err.stack || err.toString());
			process.exit(1);
		}
	);
}
