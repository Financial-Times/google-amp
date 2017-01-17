'use strict';

const cheerio = require('cheerio');

module.exports = transforms => (body, options) => {
	const $ = cheerio.load(body, {decodeEntities: false});

	return transforms($, options).then(() => $.html());
};
