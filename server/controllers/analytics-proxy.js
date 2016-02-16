const gif = new Buffer('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
const path = require('path');
const fs = require('fs-promise');

module.exports = (req, res, next) => {

	fs.writeFile(`${path.resolve('analytics.log')}`, `${new Date().toJSON()} ${req.method}: ${JSON.stringify(req.query || {})}\n`);

	// Switch between JSON and image/gif depending on what the client sent
	//
	// https://github.com/ampproject/amphtml/blob/master/extensions/amp-analytics/amp-analytics.md
	// 		- beacon Indicates navigator.sendBeacon can be used to transmit
	// 			the request. This will send a POST request, with credentials, and an empty body.
	// 		- xhrpost Indicates XMLHttpRequest can be used to transmit the request.
	// 			This will send a POST request, with credentials, and an empty body.
	//		- image Indicates the request can be sent by generating an
	//			Image tag. This will send a GET request.
	if (req.method === 'POST') {
		res.setHeader('Content-Type', 'application/json');
		res.status(202).json({'status': 'ok'});
	} else {
		res.setHeader('Content-Type', 'image/gif');
		res.status(202).send(gif);
	}
};

