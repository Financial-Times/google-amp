'use strict';

const postCss = require('postcss');
const scss = require('node-sass');
const renderScss = require('@quarterto/promisify')(scss.render);
const sassFunctions = require('@quarterto/sass-functions');
const sassEnv = require('@quarterto/sass-env');
const sassFlag = require('@quarterto/sass-flag');
const featureMatrix = require('@quarterto/feature-matrix');
const path = require('path');
const Warning = require('../warning');
const reportError = require('../report-error');

const scssPath = path.resolve('scss');
const bowerPath = path.resolve('bower_components');

const autoprefixer = require('autoprefixer');
const removeImportant = require('@georgecrawford/postcss-remove-important');
const inlineSvg = require('postcss-inline-svg');
const discardEmpty = require('postcss-discard-empty');
const removeUnused = require('postcss-remove-unused');
const csso = require('postcss-csso');

const featureList = [
	'test',
	'test2',
];

const compileCss = features => renderScss({
	file: path.join(scssPath, 'style.scss'),
	includePaths: [scssPath, bowerPath],
	functions: sassFunctions(sassEnv, sassFlag(features)),
})
.then(({css}) => postCss([
	autoprefixer({browsers: 'last 2 versions'}),
	removeImportant,
	inlineSvg,
	discardEmpty,
	csso,
]).process(css))
.then(compiled => compiled.toString());

const featureCSS = featureMatrix(featureList, compileCss);

module.exports = (options, article) => {
	const start = Date.now();
	return featureCSS({
		test: article.id[0] === 'd',
		test2: article.id[0] === '9',
	})
		.then(css => {
			const time = Date.now() - start;
			const bundleSize = `Compiled CSS bundle is ${css.length}`;
			const ampLimit = 'the AMP limit of 50,000 bytes.';

			if(css.length > 45000) {
				const exceeding = css.length > 50000;
				const err = new (exceeding ? Error : Warning)(
					`${bundleSize}, ${exceeding ? 'exceeding' : 'approaching'} ${ampLimit}.`
				);

				reportError(options.raven, err, {extra: {
					articleUUID: article.id,
					cssTime: time,
					cssSize: css.length,
				}});
			} else if(options.development) {
				console.log(`Notice: ${bundleSize}. Took ${time}ms`);
			}

			return css;
		});
};
