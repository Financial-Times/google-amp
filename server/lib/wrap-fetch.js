"use strict";

var log = [];

module.exports = (tag, fetch) => process.env.NODE_ENV !== 'instrument' ? fetch : function(url) {
	let label = url.filter ? url.filter[1] : url;
	let item = {tag, label, start: process.hrtime()};
	return fetch.apply(null, arguments).then(r => {
		item.end = process.hrtime();
		item.length = process.hrtime(item.start);
		log.push(item);
		return r;
	});
};

module.exports.log = log;
