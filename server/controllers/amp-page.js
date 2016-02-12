const getItem = require('../lib/getItem');
const renderArticle = require('../lib/render-article');
const transformArticle = require('../lib/transformEsV3Item.js');

module.exports = (req, res, next) => {
	getItem(req.params.uuid)
		.then(apiResponse => transformArticle(apiResponse._source))
		.then(renderArticle)
		.then(content => {
			res.send(content);
		})
		.catch(next);
};

