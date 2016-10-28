'use strict';

const compileScss = require('@quarterto/post-sass');

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
})
.then(compiled => compiled.toString());

module.exports = options => {
	const start = Date.now();
	return compileCss(options)
		.then(css => {
			const time = Date.now() - start;
			const bundleSize = `Compiled CSS bundle is ${css.length}`;
			const ampUrl = 'https://www.ampproject.org/docs/reference/spec.html#maximum-size';
			const ampLimit = `the AMP limit of 50,000 bytes: ${ampUrl}`;

			if(options.development) {
		if(css.length > 50000) {
					console.error(`WARNING: ${bundleSize}, more than ${ampLimit}. Took ${time}ms`);
		} else if(css.length > 45000) {
					console.error(`WARNING: ${bundleSize}, approaching ${ampLimit}. Took ${time}ms`);
		} else {
					console.log(`NOTICE: ${bundleSize} bytes. Took ${time}ms`);
		}

	return css;
});
