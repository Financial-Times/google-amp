'use strict';

module.exports = (req, res) => {
	const isStaging = req.app.get('env') === 'staging';
	let url = '/content/146da558-4dee-11e3-8fa5-00144feabdc0';

	if(isStaging) {
		const host = req.get('host');
		url = `https://cdn.ampproject.org/c/s/${host}${url}`;
	}

	res.redirect(url);
};
