const gif = new Buffer('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
const path = require('path');
const fs = require('fs-promise');

module.exports = (req, res, next) => {

	// console.log(req.method, JSON.stringify(req.query || {}));

	fs.writeFile(`${path.resolve('analytics.log')}`, `${new Date().toJSON()} ${req.headers.accept === 'application/json' ? 'JSON' : 'GIF'} ${req.method}: ${JSON.stringify(req.query || {})}\n`);

	// Switch between JSON and image/gif depending on what the client asked for
	if (req.headers.accept === 'application/json') {
		res.setHeader('Content-Type', 'application/json');
		res.status(202).json({'status': 'ok'});
	} else {
		res.setHeader('Content-Type', 'image/gif');
		res.status(202).send(gif);
	}
};

