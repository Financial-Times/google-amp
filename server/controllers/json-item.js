'use strict';
const getArticle = require('../lib/get-article');

module.exports = (req, res, next) => {
	getArticle(req.params.uuid)
		.then(data => {
			res.json(data);
		})
		.catch(next);
};