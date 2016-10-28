'use strict';

const compileScss = require('@quarterto/post-sass');
const sassDataURI = require('lib-sass-data-uri');

const compileCss = ({html}) => compileScss({
	postCss: [
		'autoprefixer',
		'@georgecrawford/postcss-remove-important',
		'postcss-inline-svg',
		'postcss-discard-empty',
		['postcss-uncss', {html}],
		'postcss-csso',
	],

	functions: sassDataURI,
})
.then(compiled => compiled.toString());

module.exports = ({html}) => {
	const start = Date.now();
	return compileCss({html})
		.then(css => {
			const time = Date.now() - start;
			if(css.length > 50000) {
				console.error(`WARNING: Compiled CSS bundle is ${css.length}, more than the AMP limit of 50,000 bytes: ` +
					'https://www.ampproject.org/docs/reference/spec.html#maximum-size. Took ${time}ms');
			} else if(css.length > 45000) {
				console.error(`WARNING: Compiled CSS bundle is ${css.length}, approaching the AMP limit of 50,000 bytes: ` +
					'https://www.ampproject.org/docs/reference/spec.html#maximum-size. Took ${time}ms');
			} else {
				console.log(`NOTICE: Compiled CSS bundle is ${css.length} bytes. Took ${time}ms`);
			}

			return css;
		});
};
