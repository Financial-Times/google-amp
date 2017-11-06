'use strict';

const {h, Component} = require('preact');
const c = require('classnames');
const {is} = require('css-select');

module.exports = class Blockquote extends Component {
	static selector = 'blockquote';

	static preprocess({el, original, match}) {
		return {
			isPullquote: is(el, '.n-content-pullquote'),
			content: match('.n-content-pullquote__content')[0],
			footer: match('.n-content-pullquote__footer')[0],
			original
		};
	}

	render({original, isPullquote, content, footer}) {
		original.attributes.class = c(
			'article__quote',
			'aside--content',
			'c-box',
			{
				'article__quote--full-quote': !isPullquote,
				'article__quote--pull-quote': isPullquote,
				'u-border--left': !isPullquote,
				'u-padding--left-right': !isPullquote,
				'u-border--all': isPullquote,
			}
		);

		if(isPullquote) {
			original.children.unshift(<div class="pull-quote__quote-marks"></div>);
			content.attributes.class = 'u-padding--left-right';
			footer.attributes.class = 'article__quote-footer';
		}

		return original;
	}
};
