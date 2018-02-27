'use strict';

// text-based transforms
const replaceEllipses = require('./text/replace-ellipses');
const removeLinkWhitespace = require('./text/remove-link-whitespace');

// DOM-based transforms
// const relatedBox = require('./html/related-box');
// const externalImages = require('./html/external-images');
// const trimmedLinks = require('./html/trimmed-links');
// const removeStyles = require('./html/remove-styles');
// const insertAd = require('./html/insert-ad');
// const replaceTagsWithContent = require('./html/replace-tags-with-content');
// const video = require('./html/video');
// const unfurlVideo = require('./html/unfurl-video');
// const slideshow = require('./html/slideshow');
// const interactiveGraphics = require('./html/interactive-graphics');
// const infoBox = require('./html/info-box');
// const linkAnalytics = require('./html/link-analytics');
// const removeInvalidLinks = require('./html/remove-invalid-links');
// const figure = require('./html/figure');
// const removeImageData = require('./html/remove-image-data');
// const imagePlaceholder = require('./html/image-placeholder');
// const subhead = require('./html/subhead');
//
// // runs transforms in parallel, keeping transforms that depend on each other in order.
// // `deps('foo')(bar)` tells `parallel` to run `foo` before `bar`.
// const transformBody = cheerioTransform(parallel({
// 	relatedBox: deps('externalImages')(relatedBox),
// 	figure: deps('externalImages')(figure),
// 	linkAnalytics: deps('relatedBox')(linkAnalytics),
// 	removeInvalidLinks: deps('linkAnalytics')(removeInvalidLinks),
// 	imagePlaceholder: deps('externalImages', 'relatedBox', 'figure')(imagePlaceholder),
// 	removeImageData: deps('externalImages', 'relatedBox', 'figure', 'imagePlaceholder')(removeImageData),
// 	video: deps('unfurlVideo')(video),
// 	externalImages,
// 	trimmedLinks,
// 	removeStyles,
// 	insertAd,
// 	replaceTagsWithContent,
// 	unfurlVideo,
// 	slideshow,
// 	interactiveGraphics,
// 	infoBox,
// 	subhead,
// }));

const {parseDOM} = require('htmlparser2');
const renderToString = require('@quarterto/preact-render-array-to-string');
const createTransformer = require('@quarterto/markup-components')(require('preact'));

const transform = createTransformer(
	require('./html/tweet'),
	require('./html/blockquotes'),
	require('./html/external-images'),
	require('./html/interactive-graphics'),
	require('./html/remove-unsupported'),
	require('./html/unfurl-video'),
	require('./html/youtube'),
	require('./html/youtube-link'),
	require('./html/youtube-container'),
	require('./html/picture'),
	require('./html/figure'),
	require('./html/figcaption'),
	require('./html/info-box'),
	require('./html/info-box-content'),
	require('./html/info-box-headline'),
	require('./html/related-box'),
	require('./html/related-box-title'),
	require('./html/related-box-title-text'),
	require('./html/related-box-headline'),
	require('./html/related-box-content'),
	require('./html/related-image'),
	require('./html/subhead'),
	require('./html/subhead-crosshead'),
	require('./html/link')
);

const timePromise = require('@quarterto/time-promise');

module.exports = (body, options = {}) => timePromise('body transform')(Promise.resolve(body)
	.then(replaceEllipses)
	.then(removeLinkWhitespace)
	.then(articleBody => parseDOM(articleBody, Object.assign({
		withDomLvl1: true,
		normalizeWhitespace: false,
		xmlMode: false,
		decodeEntities: true,
	}, options)))
	.then(dom => transform(dom, options))
	.then(renderToString));
