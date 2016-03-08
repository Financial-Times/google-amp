'use strict';

const log = [];

module.exports = (tag, fetch) => process.env.NODE_ENV !== 'instrument' ? fetch : function wrappedFetch(url, options) {
	const label = url.filter ? url.filter[1] : url;
	const item = {tag, label, start: process.hrtime(), group: options && options._wrappedFetchGroup};

	return fetch.apply(null, arguments).then(r => {
		item.end = process.hrtime();
		item.length = process.hrtime(item.start);
		log.push(item);
		return r;
	});
};

module.exports.log = log;
