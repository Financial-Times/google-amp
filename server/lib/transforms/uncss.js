'use strict';

const cheerio = require('cheerio');
const postcss = require('postcss');

const maybe = fn => {
	try {
		return fn();
	} catch(e) {
		return false;
	}
};

module.exports = postcss.plugin('uncss', ({html}) => {
	const $ = cheerio.load(`<html><body>${html}</body></html>`);
	return css => css.walkRules(rule => {
		if(rule.parent.name === 'keyframes') return;
		if(rule.selector && !rule.selector.match(/:(?:not)/)) {
			const selector = rule.selector.replace(/::?\w+/g, '');
			if(maybe(() => $(selector).length === 0)) {
				rule.remove();
			}
		}
	});
});
