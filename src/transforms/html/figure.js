'use strict';

const {h, Component} = require('preact');
const c = require('classnames');

module.exports = class Figure extends Component {
	static selector = 'figure.n-content-image';

	static preprocess({match}) {
		const img = match('img')[0];
		const caption = match('figcaption')[0];

		if(img) {
			const {width, height, className} = img.attributes;

			let variation;

			if(/emoticon/.test(className)) {
				variation = 'emoticon';
			} else if(width <= 150) {
				variation = 'thin';
			} else if(width <= 350) {
				variation = 'inline';
			} else if(width < height && width < 600) {
				variation = 'inline';
			} else if(width < 700) {
				variation = 'center';
			} else {
				variation = 'full';
			}

			return {variation, img, caption};
		}

		throw new Error('figure tag without an img');
	}

	render({variation, img, caption}) {
		return <figure className={c('article-image', `article-image--${variation}`)}>
			<div className='article-image__placeholder'>
				{img}
			</div>

			{caption}
		</figure>;
	}
};
