'use strict';

var cheerio = require('cheerio');
var Entities = require('html-entities').XmlEntities;

module.exports = function($) {
	var entities = new Entities();

	$('img[src]').replaceWith(function(index, el) {
		var $el = cheerio(el).clone();
		var matcher = /^https:\/\/next-geebee.ft.com\/image\/v1\/images\/raw\/(.+)\?/;
		var externalURI = $el.attr('src').match(matcher);
		if (externalURI) {
			var imageSrc = externalURI[1];
			// also unescape any html entites
			var imageSrcEncoded = encodeURIComponent(entities.decode(imageSrc));
			$el.attr('src', $el.attr('src').replace(imageSrc, imageSrcEncoded));
		}
		return $el;
	});
	return $;
};
