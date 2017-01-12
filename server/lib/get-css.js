'use strict';

const cacheIf = require('@quarterto/cache-if');
const mkdirp = require('mkdirp-promise');
const path = require('path');
const fs = require('fs-promise');
const compileScss = require('@quarterto/post-sass');
const sassDataURI = require('lib-sass-data-uri');

const cssPath = path.resolve('css');
const cssFile = `${cssPath}/style.css`;
const readCompiledCss = () => fs.readFile(cssFile, 'utf8');

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

module.exports = precompiled => {
	const start = Date.now();
	return Promise.resolve(precompiled ? cacheIf.always(readCompiledCss) : compileCss())
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

module.exports.compileForProduction = () => mkdirp(cssPath)
.then(compileCss)
.then(css => fs.writeFile(cssFile, css, 'utf8'));
