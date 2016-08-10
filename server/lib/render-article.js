'use strict';
const handlebars = require('handlebars');
const compileScss = require('@quarterto/post-sass');
const fs = require('fs-promise');
const path = require('path');
const promisify = require('@quarterto/promisify');
const glob = promisify(require('glob'));
const cacheIf = require('@quarterto/cache-if');
const promiseAllObj = require('@quarterto/promise-all-object');
const getStreamUrl = require('./get-stream-url');

const cssPath = path.resolve('css');
const viewsPath = path.resolve('views');
const partialsPath = path.resolve('views/partials');

const readCompiledCss = () => fs.readFile(`${cssPath}/style.css`, 'utf8');

const getCss = precompiled => Promise.resolve(
	precompiled ?
		cacheIf.always(readCompiledCss) :
		compileScss({
			postCss: [
				'autoprefixer',
				[
					'cssnano',
					{normalizeUrl: false}, // See https://github.com/ben-eb/postcss-normalize-url/issues/14
				],
				'@georgecrawford/postcss-remove-important',
				'postcss-inline-svg',
			],
		})
)
.then(compiled => {
	const css = compiled.toString();
	if(!precompiled) {
		if(css.length > 50000) {
			console.error(`WARNING: Compiled CSS bundle is ${css.length}, more than the AMP limit of 50,000 bytes: ` +
				'https://www.ampproject.org/docs/reference/spec.html#maximum-size.');
		} else if(css.length > 45000) {
			console.error(`WARNING: Compiled CSS bundle is ${css.length}, approaching the AMP limit of 50,000 bytes: ` +
				'https://www.ampproject.org/docs/reference/spec.html#maximum-size.');
		}
	}
	return css;
});

const readTemplate = () => fs.readFile(`${viewsPath}/article.html`, 'utf8').then(handlebars.compile);
const getTemplate = precompiled => cacheIf(() => precompiled, readTemplate);

// TODO: use n-handlebars and get this for free?
const applyPartials = () => glob(`${partialsPath}/**/*.html`)
	.then(files => {
		const promises = files.map(file => {
			const name = file.replace(/^.*\/(.*)\.html$/, '$1');
			return fs.readFile(file, 'utf8')
				.then(html => handlebars.registerPartial(name, html));
		});
		return Promise.all(promises);
	});
const getPartials = precompiled => cacheIf(() => precompiled, applyPartials);

const getAuthors = data => {
	const authors = data.metadata
		.filter(item => !!(item.taxonomy && item.taxonomy === 'authors'))
		.map(item => item.prefLabel);

	// Somtimes there are no authors in the taxonomy. It's very sad but it's true.
	return authors.length ? authors.join(', ') : (data.byline || '').replace(/^by\s+/i, '');
};

const getByline = (data, options) => {
	const promises = data.metadata
		.filter(item => !!(item.taxonomy && item.taxonomy === 'authors'))
		.map(author => getStreamUrl(author, options)
			// Ignore errors
			.catch(() => {})
			.then(streamUrl => {
				author.streamUrl = streamUrl;
				return author;
			})
		);

	return Promise.all(promises)
		.then(authors => {
			let byline = (data.byline || '').replace(/^by\s+/i, '');

			authors.filter(author => !!author.streamUrl)
				.forEach(author => {
					byline = byline.replace(author.prefLabel,
						'<a class="article-author-byline__author"' +
						` href="${author.streamUrl}">${author.prefLabel}</a>`
					);
				});
			return byline;
		});
};

const getMainImage = data => {
	if(data.mainImage) {
		return {
			url: data.mainImage.url,
			width: data.mainImage.width,
			height: data.mainImage.height,
		};
	} else {
		// Return a default logo image if an actual image is not available
		// TODO pull out the lead image from the body XML if possible
		return {
			url: 'http://im.ft-static.com/m/img/social/og-ft-logo-large.png',
			// https://developers.google.com/search/docs/data-types/articles - minimum width = 696px
			width: 696,
			height: 696,
		};
	}
};

module.exports = (data, options) => promiseAllObj({
	template: getTemplate(options.production),
	partials: getPartials(options.production),
	css: getCss(options.production),
	description: data.summaries ? data.summaries[0] : '',
	authorList: getAuthors(data),
	byline: getByline(data, options),
	mainImage: getMainImage(data),
}).then(t => t.template(Object.assign(data, t)));
