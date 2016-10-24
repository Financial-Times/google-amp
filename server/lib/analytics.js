'use strict';
const pkg = require('../../package.json');

const DEBUG = false;
const BARRIERTYPE = 'trial';

const fixBooleans = data => data.replace('"AUTHDATA(access)"', 'AUTHDATA(access)');

module.exports.getJson = ({req, uuid}) => {
	const spoor = {
		category: '${category}',
		action: '${action}',
		context: {
			root_id: 'ACCESS_READER_ID_${pageViewId}',
			content: {
				uuid,
				title: '${title}',
			},
			product: 'AMP',
			url: '${canonicalUrl}',

			// TODO: https://github.com/ampproject/amphtml/issues/2476
			// barrier: '...',

			amp_url: '${ampdocUrl}',
			amp_canonical_url: '${canonicalUrl}',
			amp_source_url: 'SOURCE_URL',
			amp_viewer: 'VIEWER',
			referrer: '${documentReferrer}',
			scroll_depth: '${percentageViewed}',
			engaged_time: 'TOTAL_ENGAGED_TIME',
			amp_request_sequence: '${requestCount}',
			amp_auth_access: 'AUTHDATA(access)',
			amp_auth_debug: 'AUTHDATA(debug)',
			amp_reader_id: 'ACCESS_READER_ID',

			destination: '${linkDestination}',
			text: '${linkText}',
			link_type: '${linkType}',

			// Since https://github.com/ampproject/amphtml/issues/2476 is still
			// unresolved, we need to construct a 'barrier' variable server-side in Spoor
			// enrichment
			amp_barrier_type: BARRIERTYPE,
			opportunity: {
				type: '${opportunityType}',
				subtype: '${opportunitySubtype}',
			},
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

			environment: req.app.get('env'),
			is_live: !!req.app.isServer,

			version: pkg.version,
		},
		user: {
			ft_session: 'AUTHDATA(session)',

/*
			// See /views/partials/abTest.html and /scss/abTest.scss
			ab: {
				'background-color-test': 'VARIANT(background-color-test)',
			},
*/
		},
		time: {
			amp_timestamp: '${timestamp}',
		},
	};

	if(process.env.HEROKU_RELEASE_CREATED_AT) {
		Object.assign(spoor.system, {
			release_created_at: new Date(process.env.HEROKU_RELEASE_CREATED_AT).getTime(),
			release_version: process.env.HEROKU_RELEASE_VERSION,
			slug_commit: process.env.HEROKU_SLUG_COMMIT,
		});
	}

	const url = DEBUG ? `//${req.get('host')}/analytics` : 'https://spoor-api.ft.com/ingest';

	// Try to read the spoor-id cookie if set, and create one if not. Ensure only to do
	// this once per request, otherwise multiple different cookies are created and overwritten.
	const visitorIdentifier = '${clientId(spoor-id)}';

	const data = fixBooleans(JSON.stringify(spoor));

	const json = {
		requests: {
			standard: `${url}?spoor-id=${visitorIdentifier}&data=${data}`,
		},
		triggers: {

			// See: https://github.com/ampproject/amphtml/issues/1540
			pageview: {
				on: 'access-viewed',
				request: 'standard',
				vars: {
					category: 'page',
					action: 'view',
				},
			},

			pageimpression: {
				on: 'visible',
				request: 'standard',
				vars: {
					category: 'page',
					action: 'visible',
				},
			},

			// NB: https://github.com/ampproject/amphtml/issues/2046
			click: {
				on: 'click',
				selector: 'a, button, amp-social-share',
				request: 'standard',
				vars: {
					category: 'link',
					action: 'click',
				},
			},

			lsuVisible: {
				on: 'visible',
				request: 'standard',
				visibilitySpec: {
					selector: '#light-signup',
					visiblePercentageMin: 99,
					continuousTimeMin: 2000,
				},
				vars: {
					category: 'light-signup',
					action: 'dwell',
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
			barrierView: {
				on: 'visible',
				request: 'standard',
				vars: {
					category: 'barrier',
					action: 'view',
					opportunityType: 'barrier',
					opportunitySubtype: BARRIERTYPE,
				},
				visibilitySpec: {
					selector: '#barrier-offers',
					visiblePercentageMin: 0,
					totalTimeMin: 0,
					continuousTimeMin: 0,
				},
			},
		},
		transport: {
			beacon: true,
			xhrpost: true,
			image: true,
		},
	};

	return json;
};
