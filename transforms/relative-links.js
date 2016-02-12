"use strict";

var cheerio = require('cheerio');

module.exports = function ($) {

	// TODO: MA: I suggest deleting these from here and adding these as redirects in next-redirector
	$('a').replaceWith(function(index, el) {
		el = cheerio(el);
		if (el.attr('href')) {
			el.attr('href', el.attr('href').replace(/https?:\/\/(?:www\.)?ft\.com\/topics\/places/, '/stream/regions'));
			el.attr('href', el.attr('href').replace(/https?:\/\/(?:www\.)?ft\.com\/topics/, '/stream'));
			el.attr('href', el.attr('href').replace(/https?:\/\/(?:www\.)?ft\.com\/cms(?:\/s\/[0-9])?\/([a-zA-Z0-9-]+)\.html/, '/content/$1'));
			if (/^\/stream\//.test(el.attr('href'))) {
				el.attr('href', el.attr('href').replace(/_/g, ' '));
			}
		}
		return el.clone();
	});

	return $;
};
