'use strict';

const cheerio = require('cheerio');

module.exports = (...transforms) => (body, options) => {
	const $ = cheerio.load(body, {decodeEntities: false});

	return Promise.all(transforms.map(
		transform => transform($, options)
	)).then(() => $.html());
};
