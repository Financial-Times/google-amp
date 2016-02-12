const getItem = require('../lib/getItem');

module.exports = (req, res, next) => {
	getItem(req.params.uuid)
		.then(data => {
			res.json(data);
		})
				.catch(next)
};

