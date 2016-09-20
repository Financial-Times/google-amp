'use strict';
const errors = require('http-errors');
const analytics = require('../lib/analytics');

module.exports = (req, res, next) => {
	if(!req.query.__amp_source_origin) {
		return next(new errors.BadRequest('__amp_source_origin is required'));
	}

	if(req.app.isLocal) {
		res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	} else {
		res.setHeader('Cache-Control', `public, max-age=${60 * 60 * 24}`);
	}

	// CORS
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
	res.setHeader('Access-Control-Allow-Credentials', 'true');

	// AMP-specific
	res.setHeader('AMP-Access-Control-Allow-Source-Origin', req.query.__amp_source_origin);
	res.setHeader('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');

	const json = analytics.getJson({req});

	res.setHeader('Content-Type', 'application/json');
	res.status(202).send(JSON.stringify(json));
};
