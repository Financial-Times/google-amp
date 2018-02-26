'use strict';

const {h, Component} = require('preact');

module.exports = class FigCaption extends Component {
	static selector = 'figcaption.n-content-image__caption';

	static preprocess({original}) {
		if(typeof original.children[0] === 'string') {
			return {text: original.children[0]};
		}
	}

	render({text}) {
		return text
			? <figcaption className='article-image__caption'>{text}</figcaption>
			: null;
	}
};
