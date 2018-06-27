'use strict';

const match = require('@quarterto/cheerio-match-multiple');
const apply = require('@quarterto/cheerio-apply');
const url = require('url');

const youtube = videoId => `<amp-youtube
	data-videoid="${videoId}"
	layout="responsive"
	width="480" height="270">
</amp-youtube>`;

module.exports = match({
	'a[href^="http://video.ft.com/"]:empty'(el, i, $, {brightcoveAccountId, brightcovePlayerId} = {}) {
		const [, videoId] = el.attr('href').match(/http:\/\/video.ft.com\/(.+)$/);

		return `<amp-brightcove
			data-account="${brightcoveAccountId}"
			data-player="${brightcovePlayerId}"
			data-embed="default"
			data-video-id="${videoId}"
			layout="responsive"
			width="480" height="270">
		</amp-brightcove>`;
	},

	'div.video-container.video-container-ftvideo'(el, i, $, {brightcoveAccountId, brightcovePlayerId} = {}) {
		const [, videoId] = el.find('param[name="linkBaseURL"]').attr('value').match(/http:\/\/video.ft.com\/v\/(.+)$/);

		return `<div class="n-content-video n-content-video--brightcove">
		<amp-brightcove
			data-account="${brightcoveAccountId}"
			data-player="${brightcovePlayerId}"
			data-embed="default"
			data-video-id="${videoId}"
			layout="responsive"
			width="480" height="270">
		</amp-brightcove>
		</div>`;
	},

	'p:has(a[href*="youtube.com/watch"]:only-child:empty)'(el) {
		return apply(this, 'a[href*="youtube.com/watch"]:empty', el);
	},

	'a[href*="youtube.com/watch"]:empty'(el) {
		const {query: {v: videoId}} = url.parse(el.attr('href'), true);
		return youtube(videoId);
	},

	'div.video-container.video-container-youtube'(el) {
		return youtube(el.find('[data-asset-ref]').data('asset-ref'));
	},

	'iframe[src^="https://www.youtube.com/embed/"]'(el) {
		const {pathname} = url.parse(el.attr('src'));
		const [, videoId] = pathname.match(/\/embed\/(.+)$/) || [];
		return youtube(videoId);
	},
});
