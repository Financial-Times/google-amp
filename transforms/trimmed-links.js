"use strict";

var cheerio = require('cheerio');

module.exports = function ($) {
	$('a').replaceWith(function(index, el) {
		el = cheerio(el);
		var matches;
		var contents = el.html()
			.replace("\n", " ")
			.replace('&#x2018;', '‘')
			.replace('&#x2019;', '’')
			.replace('&#x201C;', '“')
			.replace('&#x201D;', '”');

		var quoteReg = /^([“‘]) ?(.*) ?([”’])$/;
		matches = quoteReg.exec(contents);
		if (matches) {
			el.html(matches[2]);
			return matches[1] + $.html(el) + matches[3];
		}

		var trailingReg = /([ ,.;:]\s*)$/m;
		var trailing = '';
		var leadingReg = /^([ ,.;:]\s*)/m;
		var leading = '';
		matches = trailingReg.exec(contents);
		if (matches) {
			contents = contents.replace(trailingReg, '');
			trailing = matches[0];
		}
		matches = leadingReg.exec(contents);
		if (matches) {
			contents = contents.replace(leadingReg, '');
			leading = matches[0];
		}
		el.html(contents);
		return (leading + $.html(el) + trailing);
	});

	return $;
};
