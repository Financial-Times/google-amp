'use strict';

const compileScss = require('@quarterto/post-sass');

const compileCss = ({html}) => compileScss({
	postCss: [
		'autoprefixer',
		'@georgecrawford/postcss-remove-important',
		'postcss-inline-svg',
		'postcss-discard-empty',
		['postcss-uncss', {html}],
		'postcss-csso',
	],
})
.then(compiled => compiled.toString());

module.exports = ({html}) => {
	const start = Date.now();
	return compileCss({html})
		.then(css => {
			const time = Date.now() - start;
			const bundleSize = `Compiled CSS bundle is ${css.length}`;
			const ampUrl = 'https://www.ampproject.org/docs/reference/spec.html#maximum-size';
			const ampLimit = `the AMP limit of 50,000 bytes: ${ampUrl}`;

			if(css.length > 50000) {
				console.error(`WARNING: ${bundleSize}, more than ${ampLimit}. Took ${time}ms`);
			} else if(css.length > 45000) {
				console.error(`WARNING: ${bundleSize}, approaching ${ampLimit}. Took ${time}ms`);
			} else {
				console.log(`NOTICE: ${bundleSize} bytes. Took ${time}ms`);
			}

			return css;
		});
};
