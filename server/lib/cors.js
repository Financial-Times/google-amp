'use strict';

const {Forbidden} = require('http-errors');

const validFtOrigin = origin => {
	if(/\.ft\.com$/.test(origin)) {
		return true;
	}

	// TODO: better regex
	if(/ft-google-amp.+\.herokuapp\.com$/.test(origin)) {
		return true;
	}

	return false;
};

const validCorsOrigin = origin => {
	if(/\.ampproject\.org$/.test(origin)) {
		return true;
	}

	return validFtOrigin(origin);
};

module.exports = (req, res, next) => {
	if(req.get('origin')) {
		if(validCorsOrigin(req.get('origin'))) {
			res.setHeader('Access-Control-Allow-Origin', req.get('origin'));
			res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
			res.setHeader('Access-Control-Allow-Credentials', 'true');
			res.vary('origin');
		} else {
			return next(new Forbidden());
		}

		if(validFtOrigin(req.query.__amp_source_origin)) {
			res.setHeader('AMP-Access-Control-Allow-Source-Origin', req.query.__amp_source_origin);
			res.setHeader('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');
		} else {
			return next(new Forbidden());
		}
	} else if(req.get('AMP-Same-Origin') !== 'true') {
		return next(new Forbidden());
	}

	next();
};
