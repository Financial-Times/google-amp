'use strict';

const {Component, h} = require('preact');
const getViableParagraph = require('../utils/get-viable-paragraph');

const Ad = () => <div className='ad-container'>
	<amp-ad width='300' height='250' type='doubleclick'></amp-ad>
</div>;

module.exports = class InsertAd extends Component {
	static selector = ':root';

	static preprocess({el, __unsafeOriginal, options = {}}) {
		if(options.enableAds) {
			const paragraph = getViableParagraph(el);
			const position = el.children.indexOf(paragraph);
			// munge the children in preprocess because render won't be called
			// (it's the fake root that's stripped before render)
			__unsafeOriginal.children.splice(
				position, 0,
				<Ad />
			);
		}

		return {original: __unsafeOriginal};
	}

	render({original}) {
		return original;
	}
};
