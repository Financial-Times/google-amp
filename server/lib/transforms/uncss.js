'use strict';

const cheerio = require('cheerio');
const postcss = require('postcss');

module.exports = postcss.plugin('uncss', ({html}) => {
	const $ = cheerio.load(`<body>${html}</body>`);
	console.log($('body').length);
	return css => css.each(rule => {
		if(rule.selector && !rule.selector.includes(':') && !$(rule.selector).length) {
			console.log(`removing ${rule.selector}`);
			rule.remove();
		}
	});
});
