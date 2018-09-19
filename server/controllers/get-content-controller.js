'use strict';

const analytics = require('../lib/analytics');

module.exports = ({fetch, transform, template}) => async (req, res, next) => {
	try {
		const content = await transform(
			await fetch(req.params.uuid),
			{
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
				overrideBlog: req.query.overrideBlog,
				lastUpdate: req.query.amp_latest_update_time,
				ftConsentCookie: req.cookies.FTConsent,
			}
		);

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

		res.render(template, Object.assign({layout: 'layout'}, content));
	} catch(error) {
		next(error);
	}
};
