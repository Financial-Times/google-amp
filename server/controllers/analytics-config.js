const errors = require('http-errors');

const DEBUG = false;

module.exports = (req, res, next) => {
	if(!req.query.__amp_source_origin) {
		return next(new errors.BadRequest('__amp_source_origin is required'));
	}

	if(!DEBUG) res.setHeader('Cache-Control', `public, max-age=${60 * 60 * 24}`);

	// CORS
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
	res.setHeader('Access-Control-Allow-Credentials', 'true');

	// AMP-specific
	res.setHeader('AMP-Access-Control-Allow-Source-Origin', req.query.__amp_source_origin);
	res.setHeader('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');

	const spoor = {
		category: '${category}',
		action: '${action}',
		context: {
			content: {
				uuid: '${uuid}',
				title: '${title}',
			},
			product: 'AMP',
			url: '${canonicalUrl}',
			amp_url: '${ampdocUrl}',
			amp_canonical_url: '${canonicalUrl}',
			amp_source_url: 'SOURCE_URL',
			amp_viewer: 'VIEWER',
			referrer: '${documentReferrer}',
			scroll_depth: '${percentageViewed}',
			ampRequestCount: '${requestCount}',
		},
		device: {
			dimensions: {
				width: 'AVAILABLE_SCREEN_WIDTH',
				height: 'AVAILABLE_SCREEN_HEIGHT',
			},
		},
		system: {
			api_key: process.env.SPOOR_API_KEY,
			source: 'amp-analytics',

			// TODO: check these
			environment: (req.app.get('env') === 'production' ? 'p' : 'd'),
			is_live: (req.app.get('env') === 'production'),

			// TODO: versioning
			version: '1.0.0',
		},
		user: {
			ft_session: 'AUTHDATA(session)',
			amp_auth_access: 'AUTHDATA(access)',
			amp_auth_debug: 'AUTHDATA(debug)',
			amp_reader_id: 'ACCESS_READER_ID',

			// When this key becomes populated in analytics, it signals that amp-access-analytics
			// has been enabled.
			amp_auth_ft_session: 'AUTHDATA(session)',
		},
		time: {
			amp_timestamp: '${timestamp}',
		},
	};

	if(process.env.HEROKU_RELEASE_CREATED_AT) {
		spoor.context.heroku = {
			release_created_at: new Date(process.env.HEROKU_RELEASE_CREATED_AT).getTime(),
			release_version: process.env.HEROKU_RELEASE_VERSION,
			slug_commit: process.env.HEROKU_SLUG_COMMIT,
		};
	}

	const url = DEBUG ? `//${req.get('host')}/analytics` : 'https://spoor-api.ft.com/ingest';

	// Try to read the spoor-id cookie if set, and create one if not. Ensure only to do
	// this once per request, otherwise multiple different cookies are created and overwritten.
	const visitorIdentifier = '${clientId(spoor-id)}';

	const json = {
		requests: {
			standard: `${url}?spoor-id=${visitorIdentifier}&data=${JSON.stringify(spoor)}`,
		},
		triggers: {
			pageview: {
				on: 'visible',
				request: 'standard',
				vars: {
					category: 'page',
					action: 'view',
				},
			},

			// NB: https://github.com/ampproject/amphtml/issues/2046
			anchorclick: {
				on: 'click',
				selector: 'a',
				request: 'standard',
				vars: {
					category: 'link',
					action: 'click',
				},
			},

			// Something like https://github.com/Financial-Times/n-instrumentation
			// /blob/920a8ad7cfaeccc02720dd386a2149674719bd0b/src/analytics
			// /scroll-depth.js#L20-L30
			scroll25: {
				on: 'scroll',
				request: 'standard',
				vars: {
					category: 'page',
					action: 'scrolldepth',
					percentageViewed: 25,
				},
				scrollSpec: {
					verticalBoundaries: [25],
				},
			},
			scroll50: {
				on: 'scroll',
				request: 'standard',
				vars: {
					category: 'page',
					action: 'scrolldepth',
					percentageViewed: 50,
				},
				scrollSpec: {
					verticalBoundaries: [50],
				},
			},
			scroll90: {
				on: 'scroll',
				request: 'standard',
				vars: {
					category: 'page',
					action: 'scrolldepth',
					percentageViewed: 90,
				},
				scrollSpec: {
					verticalBoundaries: [90],
				},
			},

			accessAuthorizationReceived: {
				on: 'access-authorization-received',
				request: 'standard',
				vars: {
					category: 'amp-access',
					action: 'access-authorization-received',
				},
			},
			accessAuthorizationFailed: {
				on: 'access-authorization-failed',
				request: 'standard',
				vars: {
					category: 'amp-access',
					action: 'access-authorization-failed',
				},
			},
			accessViewed: {
				on: 'access-viewed',
				request: 'standard',
				vars: {
					category: 'amp-access',
					action: 'access-viewed',
				},
			},
			accessPingbackSent: {
				on: 'access-pingback-sent',
				request: 'standard',
				vars: {
					category: 'amp-access',
					action: 'access-pingback-sent',
				},
			},
			accessPingbackFailed: {
				on: 'access-pingback-failed',
				request: 'standard',
				vars: {
					category: 'amp-access',
					action: 'access-pingback-failed',
				},
			},
			accessLoginStarted: {
				on: 'access-login-started',
				request: 'standard',
				vars: {
					category: 'amp-access',
					action: 'access-login-started',
				},
			},
			accessLoginSuccess: {
				on: 'access-login-success',
				request: 'standard',
				vars: {
					category: 'amp-access',
					action: 'access-login-success',
				},
			},
			accessLoginRejected: {
				on: 'access-login-rejected',
				request: 'standard',
				vars: {
					category: 'amp-access',
					action: 'access-login-rejected',
				},
			},
			accessLoginFailed: {
				on: 'access-login-failed',
				request: 'standard',
				vars: {
					category: 'amp-access',
					action: 'access-login-failed',
				},
			},
		},
		transport: {
			beacon: true,
			xhrpost: true,
			image: true,
		},
	};

	res.setHeader('Content-Type', 'application/json');
	res.status(202).send(JSON.stringify(json));
};
