const Entities = require('html-entities').XmlEntities;
const fetch = require('node-fetch');

module.exports = function externalImages($, options) {
	const entities = new Entities();

	return Promise.all($('amp-img[src]').map((index, el) => {
		const $el = $(el);
		const matcher = /^https:\/\/h2.ft.com\/image\/v1\/images\/raw\/(.+)\?/;
		const externalURI = $el.attr('src').match(matcher);

		if(externalURI) {
			const imageSrc = externalURI[1];
			const imageSrcEncoded = encodeURIComponent(imageSrc);
			// also unescape any html entites
			const fullSrcEncoded = entities.decode($el.attr('src').replace(imageSrc, imageSrcEncoded));
			$el.attr('src', fullSrcEncoded);

			const metaUrl = fullSrcEncoded.replace('raw', 'metadata');
			return fetch(metaUrl)
				.then(response => response.json())
				.then(
					meta => Object.assign(meta, {ratio: meta.height / meta.width}),
					(e) => (
						options.raven && options.raven.captureException(e),
						{width: 600, ratio: 4 / 7} // discard error and use fallback dimensions
					)
				).then(meta => {
					const width = Math.min(600, meta.width);
					const height = width * meta.ratio;

					$el.attr({
						width: width,
						height: height,
					});

					if(width < 600) {
						// don't stretch narrow images to page width
						$el.attr('layout', 'fixed');
					}
				});
		}

		return $el;
	}).toArray()).then(() => $);
};
