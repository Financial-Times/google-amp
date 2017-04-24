'use strict';

const match = require('@quarterto/cheerio-match-multiple');
const fetchres = require('fetchres');

const fetch = require('../../fetch/wrap')(require('node-fetch'), {
	tag: 'unfurl-videos',
});

const getSources = ({renditions}) => renditions.map(
	({url, mediaType, width}) => `<source src="${url}" type=${mediaType} media="(max-width: ${width}px)">`
).join('\n');

const getDimensions = ({renditions}) => {
	const aspect = renditions[0].height / renditions[0].width;
	return `width="480" height="${Math.round(480 * aspect)}"`;
};

const videoTemplate = video => `
<amp-video ${getDimensions(video)} poster="${video.posterImageUrl}" controls>
	${getSources(video)}
</amp-video>`;

const unfurlVideo = videoId => fetch(`https://next-media-api.ft.com/v1/${videoId}`)
	.then(fetchres.json)
	.then(videoTemplate);

module.exports = ($, options = {}) => {
	if(!options.unfurlVideos) return $;

	const promises = [];
	const queueUnfurl = (el, videoId) => videoId && promises.push(
		unfurlVideo(videoId).then(video => el.replaceWith(video))
	);

	match({
		'.n-content-video--brightcove'(el) {
			const [, videoId] = el.find('a').attr('href').match(/http:\/\/video.ft.com\/(.+)$/) || [];
			queueUnfurl(el, videoId);
		},

		'.n-content-video--internal'(el) {
			const [, videoId] = el.find('a').attr('href').match(/www.ft.com\/video\/(.+)$/) || [];
			queueUnfurl(el, videoId);
		},
	})($, options);

	return Promise.all(promises).then(() => $);
};
