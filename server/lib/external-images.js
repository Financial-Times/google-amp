const Entities = require('html-entities').XmlEntities;
const fetch = require('node-fetch');

module.exports = function externalImages($, options) {
	const entities = new Entities();

	return Promise.all($('amp-img[src]').map((index, el) => {
		const $el = $(el);
		const isAside = !!$el.parents('.c-box').length;
		const matcher = /^https:\/\/h2.ft.com\/image\/v1\/images\/raw\/(.+)\?/;
		const imageSrc = $el.attr('src');
		const externalURI = (imageSrc.match(matcher) || [])[1];

		if(externalURI) {
			// Unescape any html entites
			const externalURIEntitiesDecoded = entities.decode(externalURI);
			const externalURIEncoded = encodeURIComponent(externalURIEntitiesDecoded);
			const imageSrcEncoded = imageSrc.replace(externalURI, externalURIEncoded);

			$el.attr('src', imageSrcEncoded);

			const metaUrl = entities.decode(imageSrcEncoded).replace('raw', 'metadata');
			return fetch(metaUrl)
				.then(response => response.ok ?
					response :
					Promise.reject(Error(
						`Failed to get image metadata for ${metaUrl}.` +
						` ${response.status}: ${response.statusText}`)
					))
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
						width,
						height,
					});

					if(!isAside && width < 600) {
						// don't stretch narrow inline images to page width
						$el.attr('layout', 'fixed');
					}
				});
		}

		return $el;
	}).toArray()).then(() => $);
};
