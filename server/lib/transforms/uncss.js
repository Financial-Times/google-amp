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

module.exports = postcss.plugin('uncss', ({html, preserveFlags = {}}) => {
	const $ = cheerio.load(`<html><body>${html}</body></html>`);
	let preserve = false;

	return css => css.walk(node => {
		switch(node.type) {
			case 'rule': {
				if(preserve) return;
				if(node.parent.name === 'keyframes') return;
				if(node.selector && !node.selector.match(/:(?:not)/)) {
					const selector = node.selector.replace(/::?\w+/g, '');
					if(maybe(() => $(selector).length === 0)) {
						node.remove();
					}
				}

				break;
			}

			case 'comment': {
				const [matches, action, flag] = node.text.match(/uncss:(\w+)\((\w+)\)/) || [false];
				if(matches && preserveFlags[flag]) {
					if(action === 'startPreserve') {
						preserve = true;
					} else if(action === 'endPreserve') {
						preserve = false;
					}
				}
				break;
			}

			default: {
				// noop
			}
		}
	});
});
