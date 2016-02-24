const cheerio = require('cheerio');
const Entities = require('html-entities').XmlEntities;

module.exports = function externalImages($) {
	const entities = new Entities();

	$('amp-img[src]').replaceWith((index, el) => {
		const $el = cheerio(el).clone();
		const matcher = /^https:\/\/h2.ft.com\/image\/v1\/images\/raw\/(.+)\?/;
		const externalURI = $el.attr('src').match(matcher);

		if(externalURI) {
			const imageSrc = externalURI[1];
			// also unescape any html entites
			const imageSrcEncoded = encodeURIComponent(entities.decode(imageSrc));
			$el.attr('src', $el.attr('src').replace(imageSrc, imageSrcEncoded));

			// TODO: Properly set image dimensions.
			// We *have* to specify a height and width for AMP to validate but we dont know
			// what the height value will be. Width is set in the request to the image proxy
			if(!$el.attr('height')) {
				$el.attr('width', '700px');
				$el.attr('height', '400px');
			}
		}

		return $el;
	});

	return $;
};
