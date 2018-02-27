'use strict';

const {h, Component} = require('preact');
const Link = require('./link');

module.exports = class RelatedImage extends Component {
	static selector = 'a.n-content-related-box__image-link';

	static preprocess(props) {
		const {original, match} = props;
		const img = match('img')[0];
		return {
			original,
			img,
			link: Link.preprocess(props),
		};
	}

	render({original, img, link}) {
		original.children = [<div key='wrapper' className='article-image__placeholder'>
			{img}
		</div>];

		Object.assign(original.attributes, {
			'data-trackable': 'link-image',
			class: null,
		});

		return <div className='aside--image'>
			<Link {...link} />
		</div>;
	}
};
