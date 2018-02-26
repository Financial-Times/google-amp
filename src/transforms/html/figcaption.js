'use strict';

const {h, Component} = require('preact');
const textContent = require('@quarterto/domhandler-text-content');

module.exports = class FigCaption extends Component {
	static selector = 'figcaption.n-content-image__caption';

	static preprocess({el}) {
		return {text: textContent(el)};
	}

	render({text}) {
		return text
			? <figcaption className='article-image__caption'>{text}</figcaption>
			: null;
	}
};
