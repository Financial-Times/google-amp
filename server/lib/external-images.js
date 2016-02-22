'use strict';

var cheerio = require('cheerio');
var Entities = require('html-entities').XmlEntities;

module.exports = function($) {
	var entities = new Entities();
	$('amp-img[src]').replaceWith(function(index, el) {
		var $el = cheerio(el).clone();
		var matcher = /^https:\/\/h2.ft.com\/image\/v1\/images\/raw\/(.+)\?/;
		var externalURI = $el.attr('src').match(matcher);
		if (externalURI) {
			var imageSrc = externalURI[1];
			// also unescape any html entites
			var imageSrcEncoded = encodeURIComponent(entities.decode(imageSrc));
			$el.attr('src', $el.attr('src').replace(imageSrc, imageSrcEncoded));
            
            // TODO: Properly set image dimensions.
            // We *have* to specify a height and width for AMP to validate but we dont know
            // what the height value will be. Width is set in the request to the image proxy 
            if (!$el.attr('height')) {
                $el.attr('width', '700px');
                $el.attr('height', '400px');    
            }
		}
		return $el;
	});
	return $;
};
