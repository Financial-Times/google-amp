'use strict';

var _class, _temp;

const { h, Component } = require('preact');

const { XmlEntities: entities } = require('html-entities');
const fetchres = require('fetchres');
const { STATUS_CODES: statusCodes } = require('http');
const reportError = require('../../report-error');
const Warning = require('../../warning');
const url = require('url');
const fetch = require('../../fetch/wrap')(require('node-fetch'));

const imageServiceUrl = (uri, { mode, width } = {}) => url.format({
	protocol: 'https',
	hostname: 'www.ft.com',
	pathname: `/__origami/service/image/v2/images/${mode}/${encodeURIComponent(uri)}`,
	query: Object.assign({
		source: 'google-amp',
		fit: 'scale-down'
	}, width ? { width } : {})
});

// See Sass variables
const maxColumnWidth = 500;
const pagePadding = 10;
const minColumnWidth = 320 - 2 * pagePadding;
const maxAsideWidth = 470;

async function getWidthAndRatio(metaUrl, options) {
	try {
		const meta = await fetchres.json((await fetch(metaUrl)));
		return Object.assign(meta, {
			ratio: meta.height / meta.width
		});
	} catch (err) {
		if (fetchres.originatedError(err)) {
			reportError(options.raven, new Warning(`Failed to get image metadata for ${metaUrl}. ${err.message}: ${statusCodes[err.message]}`), { extra: { metaUrl } });

			return { width: maxColumnWidth, ratio: 4 / 7 }; // discard error and use fallback dimensions
		}

		throw err;
	}
}

module.exports = (_temp = _class = class ExternalImages extends Component {

	static async preprocess({ el, original }) {
		const imageSrc = entities.decode(el.attribs.src).replace(/^(https?:\/\/ftalphaville.ft.com)?\/wp-content/, 'https://ftalphaville-wp.ft.com/wp-content').replace('assanka_web_chat', 'wp-plugin-ft-web-chat');

		const metaUrl = imageServiceUrl(imageSrc, { mode: 'metadata' });
		const meta = await getWidthAndRatio(metaUrl, {});
		const isAside = false;
		const width = Math.min(isAside ? maxAsideWidth : maxColumnWidth, meta.width);
		const height = width * meta.ratio;
		const src = imageServiceUrl(imageSrc, { mode: 'raw', width });

		return { src, width, height, originalDimensions: {}, alt: el.attribs.alt, originalClass: '' };
	}

	render({ src, width, height, originalDimensions, alt = '', originalClass }) {
		// if(!isAside && width < minColumnWidth) {
		// 	// don't stretch narrow inline images to page width
		// 	ampImg.attr('layout', 'fixed');
		// }

		return h('amp-img', {
			src: src,
			width: width,
			height: height,
			alt: alt,
			layout: 'responsive'
		});
	}
}, _class.selector = 'img[src]', _temp);
