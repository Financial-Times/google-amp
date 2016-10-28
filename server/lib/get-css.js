'use strict';

const compileScss = require('@quarterto/post-sass');
const sassDataURI = require('lib-sass-data-uri');

const compileCss = () => compileScss({
	postCss: [
		'autoprefixer',
		'@georgecrawford/postcss-remove-important',
		'postcss-inline-svg',
		'postcss-discard-empty',
		[
			'css-byebye',
			{
				rulesToRemove: [
					// o-header
					/\.o-header__drawer/,
					/\.o-header--simple/,
					/\.o-header--sticky/,
					/\.o-header__anon/,
					/\.o-header__search/,
					/\.o-header__subnav/,
					/\.o-header__mega/,
					/\.o-header__top-takeover/,
					/\.o-header__nav-button/,

					// o-footer
					/\.o-footer--theme-light/,

					// o-grid
					/snappy/,
				],
			},
		],
		'postcss-csso',
	],

	functions: sassDataURI,
})
.then(compiled => compiled.toString());

module.exports = precompiled => compileCss()
.then(css => {
	if(!precompiled) {
		if(css.length > 50000) {
			console.error(`WARNING: Compiled CSS bundle is ${css.length}, more than the AMP limit of 50,000 bytes: ` +
				'https://www.ampproject.org/docs/reference/spec.html#maximum-size.');
		} else if(css.length > 45000) {
			console.error(`WARNING: Compiled CSS bundle is ${css.length}, approaching the AMP limit of 50,000 bytes: ` +
				'https://www.ampproject.org/docs/reference/spec.html#maximum-size.');
		} else {
			console.log(`NOTICE: Compiled CSS bundle is ${css.length} bytes.`);
		}
	}
	return css;
});
