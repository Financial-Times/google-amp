'use strict';

const {XmlEntities: entities} = require('html-entities');
const fetchres = require('fetchres');
const {STATUS_CODES: statusCodes} = require('http');
const reportError = require('../report-error');
const Warning = require('../warning');
const fetch = require('../wrap-fetch')(require('node-fetch'), {
	tag: 'external-images',
});

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

module.exports = ($, options) => Promise.all($('img[src]').toArray().map(el => {
		const $el = $(el);
		const isAside = !!$el.parents('.c-box').length;
		const matcher = /^https:\/\/image.webservices.ft.com\/v1\/images\/raw\/(.+)\?/;
		const imageSrc = $el.attr('src');
		const externalURI = (imageSrc.match(matcher) || [])[1];

		if(externalURI) {
		const ampImg = $('<amg-img>');

			// Unescape any html entites
			const externalURIEntitiesDecoded = entities.decode(externalURI);
			const externalURIEncoded = encodeURIComponent(externalURIEntitiesDecoded);
			const imageSrcEncoded = imageSrc.replace(externalURI, externalURIEncoded);

		ampImg.attr('src', imageSrcEncoded);

			const metaUrl = entities.decode(imageSrcEncoded).replace('raw', 'metadata');

			return getWidthAndRatio(metaUrl, options)
				.then(meta => {
					const width = Math.min(maxColumnWidth, meta.width);
					const height = width * meta.ratio;

				ampImg.attr({
						width,
						height,
					});

					if(!isAside && width < minColumnWidth) {
						// don't stretch narrow inline images to page width
					ampImg.attr('layout', 'fixed');
					}

				$el.replaceWith(ampImg);
				});
		}

	return null;
})).then(() => $);
