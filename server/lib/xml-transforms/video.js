'use strict';

const match = require('@quarterto/cheerio-match-multiple');
const url = require('url');

const youtube = videoId => `<amp-youtube
	data-videoid="${videoId}"
	layout="responsive"
	width="480" height="270">
</amp-youtube>`;

module.exports = match({
	'a[href^="http://video.ft.com/"]' (el, i ,$, {brightcoveAccountId, brightcovePlayerId} = {}) {
		const [, videoId] = el.attr('href').match(/http:\/\/video.ft.com\/(.+)$/)

		return `<amp-brightcove
			data-account="${brightcoveAccountId}"
			data-player="${brightcovePlayerId}"
			data-embed="default"
			data-video-id="${videoId}"
			layout="responsive"
			width="480" height="270">
		</amp-brightcove>`;
	},

	'p:has(a[href*="youtube.com/watch"])' (el) {
		return this['a[href*="youtube.com/watch"]'](el.find('a[href*="youtube.com/watch"]'));
	},

	'a[href*="youtube.com/watch"]' (el) {
		const {query: {v: videoId}} = url.parse(el.attr('href'), true);
		return youtube(videoId);
	},

	'div.video-container.video-container-youtube' (el) {
		return youtube(el.find('[data-asset-ref]').data('asset-ref'));
	}
});