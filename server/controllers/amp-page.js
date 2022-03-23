'use strict';

const assembleArticle = require('../lib/article/assemble');
const nEsClient = require('@financial-times/n-es-client');
const errors = require('http-errors');
const analytics = require('../lib/analytics');
const skipArticle = require('../lib/article/skip');
const reportError = require('../lib/report-error');

module.exports = async (req, res, next) => {
	try {
		const article = await nEsClient.get(req.params.uuid).catch(error => {
			if(error.status === 404) {
				throw new errors.NotFound(`Article ${req.params.uuid} not found`);
			}

			if(error.status) {
				reportError(req.raven, error);

				throw new errors.InternalServerError(`Elastic Search error fetching article ${req.params.uuid}`);
			}

			throw error;
		});

		const flags = res.locals.flags;
		if(flags && flags.redirectAmpPageTemp) {
			return res.redirect(302, article.url);
		}

		if(skipArticle(article)) {
			return res.redirect(article.url);
		}

		const transformedArticle = await assembleArticle(article, {
			development: req.app.isDevelopment,
			production: req.app.isProduction,
			raven: req.raven,
			host: req.get('host'),
			ip: req.ip,
			ua: req.get('User-Agent'),
			relatedArticleDeduper: [req.params.uuid],
			accessMocked: req.cookies['amp-access-mock'],
			accessMockLoggedIn: req.cookies['amp-access-mock-logged-in'],
			accessMockFcf: req.cookies['amp-access-mock-fcf'],
			accessMockPreventAccess: req.cookies['amp-access-mock-no-access'],
			uuid: req.params.uuid,
			analyticsConfig: JSON.stringify(analytics.getJson({req, uuid: req.params.uuid})),
			lastUpdate: req.query.amp_latest_update_time,
			ftConsentCookie: req.cookies.FTConsent,
		});

		if(req.cookies['amp-access-mock']) {
			// No caching, to allow access mock cookies to be applied immediately
			res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
		} else if(req.query.amp_latest_update_time) {
			// Cache live blogs poll requests for one second
			res.setHeader('cache-control', 'public, max-age=1, no-transform');
		} else {
			const oneDay = 24 * 60 * 60;
			const oneWeek = 7 * oneDay;

			res.setHeader('cache-control', `public, max-age=${oneWeek}, no-transform`);
			res.setHeader('surrogate-control', `stale-on-error=${oneWeek}, stale-while-revalidate=${oneDay}`);
		}

		res.render('article', Object.assign({layout: 'layout'}, transformedArticle));
	} catch(error) {
		next(error);
	}
};
