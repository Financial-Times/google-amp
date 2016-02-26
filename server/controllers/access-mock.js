module.exports = (req, res) => {
	// CORS
	res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
	res.setHeader('Access-Control-Allow-Credentials', 'true');

	// AMP-specific
	if(req.query.__amp_source_origin) {
		res.setHeader('AMP-Access-Control-Allow-Source-Origin', req.query.__amp_source_origin);
		res.setHeader('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');
	}

	switch(req.query.type) {
	case 'access':
	case 'pingback':
		res.setHeader('Content-Type', 'application/json');
		res.status(202).json({
			access: !!req.cookies['amp-access-mock-logged-in'],
			debug: 'access-mock dummy debug',
			session: 'access-mock dummy session',
		});
		break;
	case 'login':
		res.cookie('amp-access-mock-logged-in', 1);
		res.redirect(303, req.query.location);
		break;
	case 'logout':
		res.clearCookie('amp-access-mock-logged-in');
		res.redirect(303, req.query.location);
		break;
	default:
		res.status(404).json({
			error: `Unknown method: ${req.query.type}`,
		});
		break;
	}
};
