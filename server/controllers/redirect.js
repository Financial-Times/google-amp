'use strict';

module.exports = (req, res) => {
	const isStaging = req.app.get('env') === 'staging';
	let url = '/content/6e4accd6-9260-11e6-8df8-d3778b55a923';

	if(isStaging) {
		const host = req.get('host');
		url = `https://cdn.ampproject.org/c/s/${host}${url}`;
	}

	res.redirect(url);
};
