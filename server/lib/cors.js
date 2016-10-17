'use strict';

const validOrigin = origin => {
	if(/\.ampproject\.org$/.test(origin)) {
		return true;
	}

	if(/\.ft\.com$/.test(origin)) {
		return true;
	}

	// TODO: better regex
	if(/ft-google-amp.+\.herokuapp\.com$/.test(origin)) {
		return true;
	}

	return false;
};

module.exports = (req, res, next) => {
	if(validOrigin(req.get('origin'))) {
		res.setHeader('Access-Control-Allow-Origin', req.get('origin'));
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
		res.setHeader('Access-Control-Allow-Credentials', 'true');
	}

	// AMP-specific
	if(req.query.__amp_source_origin) {
		res.setHeader('AMP-Access-Control-Allow-Source-Origin', req.query.__amp_source_origin);
		res.setHeader('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');
	}

	next();
};
