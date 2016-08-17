'use strict';

const intentionalDelay = 1000;

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

	const signedIn = !!req.cookies['amp-access-mock-logged-in'];
	const fcf = !!req.cookies['amp-access-mock-fcf'];
	const noAccess = !!req.cookies['amp-access-mock-no-access'];
	const hasAccess = !noAccess && (fcf || signedIn);

	setTimeout(() => {
		const returnUrl = req.header('Referer');

		switch(req.query.type) {

		case 'access':
		case 'pingback':
			res.setHeader('Content-Type', 'application/json');
			res.status(202).json({
				access: hasAccess,
				debug: 'access-mock dummy debug',
				session: signedIn ? 'access-mock dummy session' : null,
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

		case 'enable':
			res.cookie('amp-access-mock', '1');
			if(returnUrl) return res.redirect(303, returnUrl);
			res.status(200).send('Your amp-access-mock cookie was set. Please revisit the ' +
				'<a href="javascript:history.back()">previous page</a>.');
			break;

		case 'clear':
			res.clearCookie('amp-access-mock');
			if(returnUrl) return res.redirect(303, returnUrl);
			res.status(200).send('Your amp-access-mock cookie was cleared. Please revisit the ' +
				'<a href="javascript:history.back()">previous page</a>.');
			break;

		case 'enable-fcf':
			res.cookie('amp-access-mock-fcf', '1');
			if(returnUrl) return res.redirect(303, returnUrl);
			res.status(200).send('Your amp-access-mock-fcf cookie was set. Please revisit the ' +
				'<a href="javascript:history.back()">previous page</a>.');
			break;

		case 'clear-fcf':
			res.clearCookie('amp-access-mock-fcf');
			if(returnUrl) return res.redirect(303, returnUrl);
			res.status(200).send('Your amp-access-mock-fcf cookie was cleared. Please revisit the ' +
				'<a href="javascript:history.back()">previous page</a>.');
			break;

		case 'prevent-access':
			res.cookie('amp-access-mock-no-access', '1');
			if(returnUrl) return res.redirect(303, returnUrl);
			res.status(200).send('Your amp_access_mock-no-access cookie was set. You will not be able to access ' +
				'content, even when signed-in. Please revisit the ' +
				'<a href="javascript:history.back()">previous page</a>.');
			break;

		case 'allow-access':
			res.clearCookie('amp-access-mock-no-access');
			if(returnUrl) return res.redirect(303, returnUrl);
			res.status(200).send('Your amp-access-mock-no-access cookie was cleared. Please revisit the ' +
				'<a href="javascript:history.back()">previous page</a>.');
			break;

		default:
			res.status(404).json({
				error: `Unknown method: ${req.query.type}`,
			});
		}
	}, intentionalDelay);
};
