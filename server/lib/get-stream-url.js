'use strict';
const fetch = require('node-fetch');

module.exports = (metadatum) => {
	const streamUrl = `http://www.ft.com/stream/${metadatum.taxonomy}Id/${metadatum.idV1}`;

	// NB. Node 5 encounters a ZLib decompression issue if a HEAD request
	// returns GZip content. See https://github.com/bitinn/node-fetch/issues/45.
	return fetch(streamUrl, {method: 'HEAD', compress: false})
		.then(res => res.status === 200 && streamUrl);
};
