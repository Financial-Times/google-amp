'use strict';

var _class, _temp;

const { h, Component } = require('preact');
const c = require('classnames');
const { is } = require('css-select');

module.exports = (_temp = _class = class Blockquote extends Component {

	static preprocess({ el, original, match }) {
		return {
			isPullquote: is(el, '.n-content-pullquote'),
			content: match('.n-content-pullquote__content')[0],
			footer: match('.n-content-pullquote__footer')[0],
			original
		};
	}

	render({ original, isPullquote, content, footer }) {
		original.attributes.class = c('article__quote', 'aside--content', 'c-box', {
			'article__quote--full-quote': !isPullquote,
			'article__quote--pull-quote': isPullquote,
			'u-border--left': !isPullquote,
			'u-padding--left-right': !isPullquote,
			'u-border--all': isPullquote
		});

		if (isPullquote) {
			original.children.unshift(h('div', { 'class': 'pull-quote__quote-marks' }));
			content.attributes.class = 'u-padding--left-right';
			footer.attributes.class = 'article__quote-footer';
		}

		return original;
	}
}, _class.selector = 'blockquote', _temp);
