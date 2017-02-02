'use strict';

const {parallel, deps} = require('@quarterto/promise-deps-parallel');
const cheerioTransform = require('../cheerio-transform');

// text-based transforms
const replaceEllipses = require('./text/replace-ellipses');
const removeLinkWhitespace = require('./text/remove-link-whitespace');

// DOM-based transforms
const relatedBox = require('./html/related-box');
const externalImages = require('./html/external-images');
const trimmedLinks = require('./html/trimmed-links');
const removeStyles = require('./html/remove-styles');
const insertAd = require('./html/insert-ad');
const lightSignup = require('./html/light-signup');
const blockquotes = require('./html/blockquotes');
const replaceTagsWithContent = require('./html/replace-tags-with-content');
const video = require('./html/video');
const slideshow = require('./html/slideshow');
const interactiveGraphics = require('./html/interactive-graphics');
const infoBox = require('./html/info-box');
const contentLinks = require('./html/content-links');
const linkAnalytics = require('./html/link-analytics');
const removeInvalidLinks = require('./html/remove-invalid-links');
const figure = require('./html/figure');
const removeImageData = require('./html/remove-image-data');
const imagePlaceholder = require('./html/image-placeholder');
const subhead = require('./html/subhead');

// runs transforms in parallel, keeping transforms that depend on each other in order.
// `deps('foo')(bar)` tells `parallel` to run `foo` before `bar`.
const transformBody = cheerioTransform(parallel({
	relatedBox: deps('externalImages')(relatedBox),
	figure: deps('externalImages')(figure),
	linkAnalytics: deps('contentLinks', 'relatedBox')(linkAnalytics),
	removeInvalidLinks: deps('contentLinks', 'linkAnalytics')(removeInvalidLinks),
	imagePlaceholder: deps('externalImages', 'relatedBox', 'figure')(imagePlaceholder),
	removeImageData: deps('externalImages', 'relatedBox', 'figure', 'imagePlaceholder')(removeImageData),
	externalImages,
	trimmedLinks,
	removeStyles,
	insertAd,
	lightSignup,
	blockquotes,
	replaceTagsWithContent,
	video,
	slideshow,
	interactiveGraphics,
	infoBox,
	contentLinks,
	subhead,
}));

module.exports = (body, options = {}) => Promise.resolve(body)
	.then(replaceEllipses)
	.then(removeLinkWhitespace)
	.then(articleBody => transformBody(articleBody, options));
