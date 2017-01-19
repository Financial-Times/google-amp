'use strict';

const {parallel, deps} = require('@quarterto/promise-deps-parallel');
const replaceEllipses = require('./xml-transforms/replace-ellipses');
const removeLinkWhitespace = require('./xml-transforms/remove-link-whitespace');
const transformBody = require('./transform-body');

const relatedBox = require('./xml-transforms/related-box');
const externalImages = require('./xml-transforms/external-images');
const trimmedLinks = require('./xml-transforms/trimmed-links');
const removeStyles = require('./xml-transforms/remove-styles');
const insertAd = require('./xml-transforms/insert-ad');
const lightSignup = require('./xml-transforms/light-signup');
const blockquotes = require('./xml-transforms/blockquotes');
const replaceTagsWithContent = require('./xml-transforms/replace-tags-with-content');
const video = require('./xml-transforms/video');
const slideshow = require('./xml-transforms/slideshow');
const interactiveGraphics = require('./xml-transforms/interactive-graphics');
const infoBox = require('./xml-transforms/info-box');
const contentLinks = require('./xml-transforms/content-links');
const linkAnalytics = require('./xml-transforms/link-analytics');
const removeInvalidLinks = require('./xml-transforms/remove-invalid-links');
const figure = require('./xml-transforms/figure');
const removeImageData = require('./xml-transforms/remove-image-data');
const imagePlaceholder = require('./xml-transforms/image-placeholder');
const subhead = require('./xml-transforms/subhead');

const cheerioTransform = transformBody(parallel({
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

module.exports = (body, {
	brightcoveAccountId = process.env.BRIGHTCOVE_ACCOUNT_ID,
	brightcovePlayerId = 'default',
} = {}) => Promise.resolve(body)
	.then(replaceEllipses)
	.then(removeLinkWhitespace)
	.then(articleBody => cheerioTransform(articleBody, {brightcovePlayerId, brightcoveAccountId}));
