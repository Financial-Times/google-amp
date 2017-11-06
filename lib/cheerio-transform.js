'use strict';

const cheerio = require('cheerio');

module.exports = transforms => (body, options) => {
	const $ = cheerio.load(body, { decodeEntities: false });
	return Promise.resolve(transforms($, options)).then(() => $.html());
};
