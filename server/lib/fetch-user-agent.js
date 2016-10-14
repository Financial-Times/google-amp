'use strict';

module.exports = (fetch, options) => (url, fetchOptions = {}) => {
	fetchOptions.headers = Object.assign({
		'user-agent': options.userAgent,
	}, fetchOptions.headers);

	return fetch(url, fetchOptions);
};
