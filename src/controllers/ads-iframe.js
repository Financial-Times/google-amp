'use strict';

module.exports = (req, res) => {
	res.render('ads-iframe', {
		adsApiHost: process.env.ADS_API_HOST,
		uuid: req.params.uuid,
	});
};
