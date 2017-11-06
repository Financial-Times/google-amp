'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp;

const { h, Component } = require('preact');
const { is, selectOne } = require('css-select');
const getVideo = require('../utils/get-video');

const getDimensions = ({ renditions }) => {
	const aspect = renditions[0].pixelHeight / renditions[0].pixelWidth;
	return {
		width: 480,
		height: Math.round(480 * aspect)
	};
};

module.exports = (_temp = _class = class UnfurlVideo extends Component {

	static async preprocess({ el, original, match }) {
		const a = selectOne('a[href]', el);

		const [, videoId] = a.attribs.href.match(/(?:http:\/\/video.ft.com\|www.ft.com\/video\/)(.+)$/) || [];

		return {
			original,
			video: videoId && (await getVideo(videoId))
		};
	}

	render({ video }) {
		if (!video) {
			return null;
		}

		return h(
			'amp-video',
			_extends({}, getDimensions(video), { poster: video.mainImageUrl, controls: true, layout: 'responsive' }),
			video.renditions.map(({ url, mediaType, pixelWidth }) => h('source', {
				src: url,
				type: mediaType,
				media: `(max-width: ${pixelWidth}px)`
			}))
		);
	}
}, _class.selector = '.n-content-video--internal, .n-content-video--brightcove', _temp);
