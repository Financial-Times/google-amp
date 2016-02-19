module.exports = (req, res, next) => {

	// CORS
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
	res.setHeader('Access-Control-Allow-Credentials', 'true');

	// AMP-specific
	res.setHeader('AMP-Access-Control-Allow-Source-Origin', req.query.__amp_source_origin);
	res.setHeader('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');

	switch (req.query.type) {
		case 'authorization':
			res.setHeader('Content-Type', 'application/json');
			res.status(202).json({
				"maxViews": 10,
				"currentViews": 6,
				"subscriber": false,
				"test": "this string was generated in access-mock.js"
			});
			break;
		case 'ping':
			res.setHeader('Content-Type', 'application/json');
			res.status(202).json({status: 'ok'});
			break;
		case 'login':
			res.setHeader('Content-Type', 'application/json');
			res.status(202).json({status: 'ok'});
			break;
	}
};

