'use strict';

const cacheIf = require('@quarterto/cache-if');
const postCss = require('postcss');
const scss = require('node-sass');
const renderScss = require('@quarterto/promisify')(scss.render);
const sassFunctions = require('@quarterto/sass-functions');
const sassEnv = require('@quarterto/sass-env');
const fs = require('fs-promise');
const mkdirp = require('mkdirp-promise');
const path = require('path');
const Warning = require('../warning');
const reportError = require('../report-error');
const promiseAllObject = require('@quarterto/promise-all-object');
const selectFeatures = require('@quarterto/select-features');
const handlebars = require('../handlebars');
const environmentOptions = require('./environment-options');

const scssPath = path.resolve('scss');
const bowerPath = path.resolve('bower_components');
const cssPath = path.resolve('css');
const cssFile = entry => `${cssPath}/${entry}.css`;
const readCompiledCss = ({entry}) => fs.readFile(cssFile(entry), 'utf8');

const autoprefixer = require('autoprefixer');
const removeImportant = require('@georgecrawford/postcss-remove-important');
const inlineSvg = require('postcss-inline-svg');
const discardEmpty = require('postcss-discard-empty');
const removeUnused = require('postcss-remove-unused');

const csso = require('csso');

const compileCss = ({entry, html} = {}) => renderScss({
	file: path.join(scssPath, `${entry}.scss`),
	includePaths: [scssPath, bowerPath],
	functions: sassFunctions(sassEnv),
})
.then(({css}) => postCss([
	autoprefixer({browsers: 'last 2 versions'}),
	removeImportant,
	inlineSvg,
	discardEmpty,
].concat(html ? [
	removeUnused({html}),
] : [])).process(css))
.then(compiled => compiled.toString());

const getCSSEntries = () => fs.readdir(scssPath)
	.then(files => files.filter(file => file.endsWith('.scss') && !file.startsWith('_'))
	.map(file => path.basename(file, '.scss')));

const getBaseHTML = entry => entry === 'base' ?
	handlebars.standalone().then(
		hbs => hbs.renderView('layouts/layout', Object.assign({
			body: '',
		}, environmentOptions))
	) : Promise.resolve(false);

const getFeatureCSS = getCSS => () => getCSSEntries().then(entries => promiseAllObject(
	entries.reduce((css, entry) => Object.assign(css, {
		[entry]: getBaseHTML(entry).then(html => getCSS({entry, html})),
	}), {})
));

const compileFeatureCSS = getFeatureCSS(compileCss);
const readFeatureCSS = getFeatureCSS(readCompiledCss);
const writeFeatureCSS = () => mkdirp(cssPath)
.then(compileFeatureCSS)
.then(features => Promise.all(
	Object.keys(features).map(
		feature => fs.writeFile(cssFile(feature), features[feature], 'utf8')
	)
));

module.exports = (article, options) => {
	const start = Date.now();
	return Promise.resolve(options.production ? cacheIf.always(readFeatureCSS) : compileFeatureCSS())
		.then(features => {
			const enabledFeatures = {
				base: true,
			};

			const bundledCSS = selectFeatures(features, enabledFeatures).join('\n');
			const {css} = csso.minify(bundledCSS);

			const time = Date.now() - start;
			const ampLimit = 'the AMP limit of 50KB';
			const bundleSize = `Compiled CSS bundle is ${css.length}`;

			if(css.length > 45000) {
				const exceeding = css.length > 50000;
				const err = new (exceeding ? Error : Warning)(
					`${bundleSize}, ${exceeding ? 'exceeding' : 'approaching'} ${ampLimit}.`
				);

				reportError(options.raven, err, {extra: {
					articleUUID: article.id,
					cssTime: time,
					cssSize: css.length,
					features: enabledFeatures,
				}});
			} else if(options.development) {
				console.log(`Notice: ${bundleSize}. Took ${time}ms. Detected features: ${JSON.stringify(enabledFeatures)}`);
			}

			return css;
		});
};

if(module === require.main) {
	const padEnd = require('lodash.padend');
	const padStart = require('lodash.padstart');

	const label = 'Generated production CSS files';
	console.time(label);
	writeFeatureCSS().then(() => {
		console.timeEnd(label);
		return readFeatureCSS();
	}).then(features => {
		console.log();
		console.log('Feature sizes');
		console.log('━━━━━━━━━━━━━━━━━━');

		const cat = Object.keys(features).reduce((css, feature) => {
			const size = features[feature].length / 1000;
			const featureLabel = padEnd(`${feature}`, 10);
			const sizeLabel = padStart(size.toFixed(2), 6);
			console.log(`${featureLabel}${sizeLabel}kb`);
			return css + features[feature];
		}, '');

		const sizeLabel = padStart((cat.length / 1000).toFixed(2), 6);
		const minLabel = padStart((csso.minify(cat).css.length / 1000).toFixed(2), 6);

		console.log('──────────────────');
		console.log(`total     ${sizeLabel}kb`);
		console.log(`minified  ${minLabel}kb`);
	}).catch(err => {
		console.error(err.stack || err.toString());
		process.exit(1);
	});
}
