const fetch = require('node-fetch');

module.exports = (metadatum) => {
	const streamUrl = `http://www.ft.com/stream/${metadatum.taxonomy}Id/${metadatum.idV1}`;

	return fetch(streamUrl)
		.then(res => res.status === 200 && streamUrl);
};
