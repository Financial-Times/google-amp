'use strict';

const Entities = require('html-entities').XmlEntities;
const fetch = require('../wrap-fetch')(require('node-fetch'), {
	tag: 'external-images',
});
const fetchres = require('fetchres');
const statusCodes = require('http').STATUS_CODES;
const reportError = require('../report-error');
const Warning = require('../warning');

// See Sass variables
const maxColumnWidth = 500;
const pagePadding = 10;
const minColumnWidth = 320 - (2 * pagePadding);

function getWidthAndRatio(metaUrl, options) {
	return fetch(metaUrl)
		.then(fetchres.json)
		.catch(err => {
			if(fetchres.originatedError(err)) {
				return Promise.reject(
					new Warning(
						`Failed to get image metadata for ${metaUrl}. ${err.message}: ${statusCodes[err.message]}`
					)
				);
			}

			return Promise.reject(err);
		})
		.then(
			meta => Object.assign(meta, {ratio: meta.height / meta.width}),
			e => {
				reportError(options.raven, e, {extra: {metaUrl}});
				return {width: maxColumnWidth, ratio: 4 / 7}; // discard error and use fallback dimensions
			}
		);
}

module.exports = function externalImages($, options) {
	const entities = new Entities();

	return Promise.all($('amp-img[src]').map((index, el) => {
		const $el = $(el);
		const isAside = !!$el.parents('.c-box').length;
		const matcher = /^https:\/\/image.webservices.ft.com\/v1\/images\/raw\/(.+)\?/;
		const imageSrc = $el.attr('src');
		const externalURI = (imageSrc.match(matcher) || [])[1];

		if(externalURI) {
			// Unescape any html entites
			const externalURIEntitiesDecoded = entities.decode(externalURI);
			const externalURIEncoded = encodeURIComponent(externalURIEntitiesDecoded);
			const imageSrcEncoded = imageSrc.replace(externalURI, externalURIEncoded);

			$el.attr('src', imageSrcEncoded);

			const metaUrl = entities.decode(imageSrcEncoded).replace('raw', 'metadata');

			return getWidthAndRatio(metaUrl, options)
				.then(meta => {
					const width = Math.min(maxColumnWidth, meta.width);
					const height = width * meta.ratio;

					$el.attr({
						width,
						height,
					});

					if(!isAside && width < minColumnWidth) {
						// don't stretch narrow inline images to page width
						$el.attr('layout', 'fixed');
					}
				});
		}

		return $el;
	}).toArray()).then(() => $);
};
