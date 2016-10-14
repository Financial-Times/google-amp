'use strict';
const getArticle = require('../lib/get-article');
const addStoryPackage = require('../lib/related-content/story-package');
const addMoreOns = require('../lib/related-content/more-ons');
const addPrimaryTheme = require('../lib/primary-theme');
const renderArticle = require('../lib/render-article');
const transformArticle = require('../lib/transform-article');
const fetchSlideshows = require('../lib/fetch-slideshows');
const transformSlideshows = require('../lib/transform-slideshows');
const url = require('../lib/url');
const analytics = require('../lib/analytics');
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
			response => {
				if(response._source && (!response._source.originatingParty || response._source.originatingParty === 'FT')) {
					return response._source;
				}

				return Promise.reject(new errors.NotFound());
			},
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

			article.showEverything = !!options.showEverything;
			article.enableSidebarMenu = !!options.enableSidebarMenu;
			article.enableSocialShare = !!options.enableSocialShare;
			article.enableBarrier = !!options.enableBarrier;

			article.accessMocked = !!options.accessMocked;
			article.accessMockLoggedIn = !!options.accessMockLoggedIn;
			article.accessMockFcf = !!options.accessMockFcf;
			article.accessMockPreventAccess = !!options.accessMockPreventAccess;

			article.canonicalURL = url.canonical(article);

			// https://jira.ft.com/browse/AT-628 The access service currently uses
			// an archaic content classification service hosted at http://www.ft.com/__access_metadata,
			// which requires URLs in the form http://www.ft.com/cms/s/2/e8813dd4-d00d-11e5-831d-09f7778e7377.html
			// in order to make classification decisions. Eventually, amp-access will be updated to
			// look up classification against CAPI, and we can use the canonical URL here.
			article.accessCheckUrl = url.accessCheck(article);

			const shareParams = {
				segmentid: segmentId,
			};
			article.shareUrl = `${article.canonicalURL}?${querystring.stringify(shareParams)}`;
			article.facebookAppId = '328135857526360';

			article.analyticsConfig = options.analyticsConfig;

			article.barrierListEndpoint = options.production ? '/products' : `//${options.host}/products`;

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
		enableBarrier: (process.env.ENABLE_BARRIER === 'true'),
		uuid: req.params.uuid,
		analyticsConfig: JSON.stringify(analytics.getJson({req, uuid: req.params.uuid})),
	})
		.then(content => {
			if(req.cookies['amp-access-mock']) {
				// No caching, to allow access mock cookies to be applied immediately
				res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
			} else {
				res.setHeader('cache-control', 'public, max-age=30, no-transform');
				res.setHeader('surrogate-control', 'stale-on-error=86400, stale-while-revalidate=300');
			}

			res.send(content);
		})
		.catch(next);
};

module.exports.getAndRender = getAndRender;

if(module === require.main) {
	getAndRender(process.argv[2], {
		production: false,
		showEverything: true,
		relatedArticleDeduper: [process.argv[2]],
	}).then(
		rendered => fs.writeFile(process.argv[3], rendered),
		err => {
			console.error(err.stack || err.toString());
			process.exit(1);
		}
	);
}
