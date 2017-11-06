'use strict';

const { Forbidden } = require('http-errors');

const validFtOrigin = origin => {
	if (/\.ft\.com$/.test(origin)) {
		return true;
	}

	// TODO: better regex
	if (/ft-google-amp.+\.herokuapp\.com$/.test(origin)) {
		return true;
	}

	if (/^https?:\/\/localhost[\w.]*(:\d+)?$/.test(origin)) {
		return true;
	}

	return false;
};

const validCorsOrigin = origin => {
	if (/\.ampproject\.org$/.test(origin)) {
		return true;
	}

	return validFtOrigin(origin);
};

module.exports = (req, res, next) => {
	const origin = req.get('origin') || req.get('AMP-Same-Origin') === 'true' && req.query.__amp_source_origin;

	if (!validCorsOrigin(origin)) {
		return next(new Forbidden());
	}

	res.setHeader('Access-Control-Allow-Origin', origin);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.vary('origin');

	if (validFtOrigin(req.query.__amp_source_origin)) {
		res.setHeader('AMP-Access-Control-Allow-Source-Origin', req.query.__amp_source_origin);
		res.setHeader('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');
	}

	next();
};
