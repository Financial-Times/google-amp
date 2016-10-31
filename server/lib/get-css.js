'use strict';

const postCss = require('postcss');
const scss = require('node-sass');
const renderScss = require('@quarterto/promisify')(scss.render);
const sassDataURI = require('lib-sass-data-uri');
const path = require('path');

const scssPath = path.resolve('scss');
const bowerPath = path.resolve('bower_components');

const postCssPlugins = [
	require('autoprefixer'),
	require('@georgecrawford/postcss-remove-important'),
	require('postcss-inline-svg'),
	require('postcss-discard-empty'),
	require('../lib/transforms/uncss'),
	// require('postcss-uncss')({html}]),
	require('postcss-csso'),
];

const compileCss = (options) => renderScss({
	file: path.join(scssPath, 'style.scss'),
	includePaths: [scssPath, bowerPath],
	functions: sassDataURI,
})
.then(({css}) => postCss(postCssPlugins.map(plugin => plugin(options))).process(css))
.then(compiled => compiled.toString());

module.exports = (options) => {
	const start = Date.now();
	return compileCss(options)
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
