const getItem = require('../lib/getItem');
const renderArticle = require('../lib/render-article');
const transformArticle = require('../lib/transformEsV3Item.js');

module.exports = (req, res, next) => {
	getItem(req.params.uuid)
		.then(apiResponse => transformArticle(apiResponse._source))
		.then(data => renderArticle(data, {
			precompiled: req.app.get('env') === 'production'
		}))
		.then(content => {
			res.send(content);
		})
		.catch(next);
};

