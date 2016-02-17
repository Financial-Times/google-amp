const DEBUG = false;

module.exports = (req, res, next) => {

	// TODO: cache this?
	res.setHeader('Cache-Control', 'no-cache, max-age=0');

	// CORS
	const origin = req.headers.origin;
	if (origin) {
		res.setHeader('Access-Control-Allow-Origin', origin);
	}

	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
	res.setHeader('Access-Control-Allow-Credentials', 'true');

	// AMP-specific
	res.setHeader('AMP-Access-Control-Allow-Source-Origin', req.query.__amp_source_origin);
	res.setHeader('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');

	const spoor = {
		category: "${category}",
		action: "${action}",
		context: {
			content: {
				uuid: "${uuid}",
				title: "${title}",
			},
			product: "AMP",
			url: "${canonicalUrl}",
			amp_url: "${ampdocUrl}",
			amp_canonical_url: "${canonicalUrl}",
			referrer: "${documentReferrer}",
			scroll_depth: "${percentageViewed}",
		},
		device: {
			spoor_id: "${clientId(spoor-id)}"
		},
		system: {
			api_key: "7107dae3-7c77-4312-92c6-93a4ba7b79ae",
			source: "amp-analytics",

			// TODO: check these
			environment: (req.app.get('env') === "production" ? "p" : "d"),
			is_live: (req.app.get('env') === "production"),

			// TODO: versioning
			version: "1.0.0"
		},
		user: {
			amp_reader_id: "ACCESS_READER_ID"
		},
		time: {
			amp_timestamp: "${timestamp}"
		}
	};

	const url = DEBUG ? "//localhost:5000/analytics" : "https://spoor-api.ft.com/ingest";

	const json = {
		requests: {
			standard: url + "?data=" + JSON.stringify(spoor)
		},
		triggers: {
			pageview: {
				on: "visible",
				request: "standard",
				vars: {
					category: "page",
					action: "view"
				}
			},

			// NB: https://github.com/ampproject/amphtml/issues/2046
			anchorclick: {
				on: "click",
				selector: "a",
				request: "standard",
				vars: {
					category: "link",
					action: "click"
				}
			},

			// Something like https://github.com/Financial-Times/n-instrumentation/blob/920a8ad7cfaeccc02720dd386a2149674719bd0b/src/analytics/scroll-depth.js#L20-L30
			scroll25: {
				on: "scroll",
				request: "standard",
				vars: {
					category: "page",
					action: "scrolldepth",
					percentageViewed: 25
				},
				"scrollSpec": {
					"verticalBoundaries": [25]
				}
			},
			scroll50: {
				on: "scroll",
				request: "standard",
				vars: {
					category: "page",
					action: "scrolldepth",
					percentageViewed: 50
				},
				"scrollSpec": {
					"verticalBoundaries": [50]
				}
			},
			scroll90: {
				on: "scroll",
				request: "standard",
				vars: {
					category: "page",
					action: "scrolldepth",
					percentageViewed: 90
				},
				"scrollSpec": {
					"verticalBoundaries": [90]
				}
			}
		},
		transport: {
			beacon: true,
			xhrpost: true,
			image: true
		}
	};

	res.setHeader('Content-Type', 'application/json');
	res.status(202).send(JSON.stringify(json));
};

