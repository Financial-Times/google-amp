'use strict';

const querystring = require('querystring');
const url = require('../url');
const segmentArticle = require('./segment');

const thirdPartyHost = process.env.HEROKU_APP_NAME ?
	`${process.env.HEROKU_APP_NAME}.herokuapp.com` :
	'localhost:5000';

const liveAccessHost = 'amp-access-svc.memb.ft.com';

const shareParams = {
	segmentid: 'acee4131-99c2-09d3-a635-873e61754ec6',
};

module.exports = (article, options) => Object.assign(article, {
	SOURCE_PORT: options.production ? '' : ':5000',

	AUTH_AUTHORIZATION_URL: options.accessMocked ?
		`//${options.host}/amp-access-mock/access?` :
		`https://${liveAccessHost}/amp-access?`,

	AUTH_PINGBACK_URL: options.accessMocked ?
		`//${options.host}/amp-access-mock/pingback?` :
		`https://${liveAccessHost}/amp-pingback?`,

	AUTH_LOGIN_URL: options.accessMocked ?
		`//${options.host}/amp-access-mock/login?` :
		'https://accounts.ft.com/login?',

	AUTH_LOGOUT_URL: options.accessMocked ?
		`//${options.host}/amp-access-mock/logout?` :
		`https://${liveAccessHost}/amp-logout?`,
	
	description: article.standfirst,

	showEverything: !!options.showEverything,
	isFree: article.accessLevel === 'free',

	accessMocked: !!options.accessMocked,
	accessMockLoggedIn: !!options.accessMockLoggedIn,
	accessMockFcf: !!options.accessMockFcf,
	accessMockPreventAccess: !!options.accessMockPreventAccess,

	enableSidebarMenu: !!options.enableSidebarMenu,
	enableSocialShare: !!options.enableSocialShare,
	enableLiveBlogs: !!options.enableLiveBlogs,
	enableBarrier: !!options.enableBarrier,
	unfurlBrightcove: !!options.unfurlBrightcove,

	canonicalURL: url.canonical(article),
	pspURL: 'https://www.ft.com/products',

	// https://jira.ft.com/browse/AT-628 The access service currently uses
	// an archaic content classification service hosted at http://www.ft.com/__access_metadata,
	// which requires URLs in the form http://www.ft.com/cms/s/2/e8813dd4-d00d-11e5-831d-09f7778e7377.html
	// in order to make classification decisions. Eventually, amp-access will be updated to
	// look up classification against CAPI, and we can use the canonical URL here.
	accessCheckUrl: url.accessCheck(article),

	shareUrl: `${url.canonical(article)}?${querystring.stringify(shareParams)}`,
	facebookAppId: '328135857526360',

	analyticsConfig: options.analyticsConfig,

	barrierListEndpoint: options.production ? '/products' : `//${options.host}/products`,

	visibilityOptIn: segmentArticle(article),
});
