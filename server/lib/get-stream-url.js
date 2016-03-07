'use strict';
const fetch = require('./wrap-fetch.js')('get-stream-url', require('node-fetch'));

module.exports = (metadatum) => {
	const streamUrl = `http://www.ft.com/stream/${metadatum.taxonomy}Id/${metadatum.idV1}`;

	// NB. Node 5 encounters a ZLib decompression issue if a HEAD request
	// returns GZip content. See https://github.com/bitinn/node-fetch/issues/45.
	return fetch(streamUrl, {method: 'HEAD', compress: false, follow: 0})
	.catch(e => {
		// Don't follow the redirect, but assume that if a redirect code is given
		//  (see Fetch.prototype.isRedirect), the falcon redirect service has
		//  found a corresponding URL on FT.com, and streamUrl can be served.
		if(/maximum redirect reached/.test(e.message)) {
			return streamUrl;
		}

		throw e;
	});
};
