'use strict';

const {h, Component} = require('preact');
const {selectOne} = require('css-select');
const getVideo = require('../utils/get-video');

const getDimensions = ({renditions}) => {
	const aspect = renditions[0].pixelHeight / renditions[0].pixelWidth;
	return {
		width: 480,
		height: Math.round(480 * aspect),
	};
};

module.exports = class UnfurlVideo extends Component {
	static selector = '.n-content-video--internal, .n-content-video--brightcove';

	static async preprocess({el, options = {}}) {
		const a = selectOne('a[href]', el);

		const [, videoId] = a.attribs.href.match(
			/(?:http:\/\/video.ft.com|https:\/\/www.ft.com\/video\/)(.+)$/
		) || [];

		try {
			return {
				video: videoId && await getVideo(videoId),
			};
		} catch(e) {
			if(options.raven) {
				options.raven.captureMessage('Next Media API call failed', {
					level: 'warning',
					extra: {e, videoId},
				});
			}
		}
	}

	render({video}) {
		if(!video) {
			return null;
		}

		return <amp-video {...getDimensions(video)} poster={video.mainImageUrl} controls layout="responsive">
			{video.renditions.map(
				({url, mediaType, pixelWidth}) => <source
					key={url}
					src={url}
					type={mediaType}
					media={`(max-width: ${pixelWidth}px)`}
				/>
			)}
		</amp-video>;
	}
};
