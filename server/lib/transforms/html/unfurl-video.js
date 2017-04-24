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

const videoPlaceholder = video => `
<div class="o-video__placeholder o-video--small" placeholder>
	<amp-img class="o-video__placeholder-image" alt="" src="${video.posterImageUrl}" ${getDimensions(video)}></amp-img>

	<div class="o-video__info">
		${video.brand ? `<span class="o-video__info-brand">${video.brand.name}</span>` : ''}
		<h4 class="o-video__info-title">${video.name}</h4>
	</div>

	<div class="o-video__play-button">
		<span class="o-video__play-button-text">Play video</span>
		<i class="o-video__play-button-icon"></i>
	</div>
</div>`;

const videoTemplate = video => `
<amp-video ${getDimensions(video)} poster="${video.posterImageUrl}" layout="responsive">
	${videoPlaceholder(video)}
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
