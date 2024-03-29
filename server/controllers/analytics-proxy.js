'use strict';

const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
const path = require('path');
const fs = require('fs-promise');

module.exports = (req, res) => {
	let data;

	try {
		data = JSON.parse(req.query.data || {});
	} catch(e) {
		return res.status(400).end('Failed to parse JSON from "data" query param.');
	}

	fs.writeFile(
		`${path.resolve('analytics.log')}`,
		`${new Date().toJSON()} ${req.method}: \n${JSON.stringify(data, undefined, '  ')}\n`,
		{flag: 'a'}
	);

	// Switch between JSON and image/gif depending on what the client sent
	//
	// https://github.com/ampproject/amphtml/blob/main/extensions/amp-analytics/amp-analytics.md
	// 		- beacon Indicates navigator.sendBeacon can be used to transmit
	// 			the request. This will send a POST request, with credentials, and an empty body.
	// 		- xhrpost Indicates XMLHttpRequest can be used to transmit the request.
	// 			This will send a POST request, with credentials, and an empty body.
	//		- image Indicates the request can be sent by generating an
	//			Image tag. This will send a GET request.
	if(req.method === 'POST') {
		res.setHeader('Content-Type', 'application/json');
		res.status(202).json(data);
	} else {
		res.setHeader('Content-Type', 'image/gif');
		res.status(202).send(gif);
	}
};
