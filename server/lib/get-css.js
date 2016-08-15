'use strict';

const cacheIf = require('@quarterto/cache-if');
const mkdirp = require('mkdirp-promise');
const path = require('path');
const fs = require('fs-promise');
const compileScss = require('@quarterto/post-sass');

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
})
.then(compiled => compiled.toString());

module.exports = precompiled => Promise.resolve(precompiled ? cacheIf.always(readCompiledCss) : compileCss())
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

module.exports.compileForProduction = () => mkdirp(cssPath)
.then(compileCss)
.then(css => fs.writeFile(cssFile, css, 'utf8'));
