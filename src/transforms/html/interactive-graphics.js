'use strict';

const match = require('@quarterto/cheerio-match-multiple');
const {h, Component} = require('preact');

module.exports = class InteractiveGraphic extends Component {
	static selector = 'a[data-asset-type="interactive-graphic"]';

	static preprocess({el}) {
		return {
			href: el.attribs.href,
			replace: el.attribs.href.startsWith('https'),
			width: el.attribs['data-width'],
			height: el.attribs['data-height'],
		}
	}

	render({replace, href, width, height}) {
		if(replace) {
			return <amp-iframe
				src={href}
				width={width}
				height={height}
				sandbox="allow-scripts allow-same-origin"
				layout="responsive"
				frameborder="0"
			/>;
		}

		return null;
	}
}
