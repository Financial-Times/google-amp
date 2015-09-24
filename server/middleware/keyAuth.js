'use strict';
const accessKey = process.env.API_KEY;
module.exports = function (req, res, next) {
	if (!req.query.apiKey || req.query.apiKey !== accessKey) {
		res.status(401).send('Bad or missing apiKey');
	} else {
		next();
	}
};
