'use strict';

const {parallel, deps} = require('@quarterto/promise-deps-parallel');
const replaceEllipses = require('./transforms/replace-ellipses');
const removeLinkWhitespace = require('./transforms/remove-link-whitespace');
const cheerioTransform = require('./cheerio-transform');

const relatedBox = require('./transforms/related-box');
const externalImages = require('./transforms/external-images');
const trimmedLinks = require('./transforms/trimmed-links');
const removeStyles = require('./transforms/remove-styles');
const insertAd = require('./transforms/insert-ad');
const lightSignup = require('./transforms/light-signup');
const blockquotes = require('./transforms/blockquotes');
const replaceTagsWithContent = require('./transforms/replace-tags-with-content');
const video = require('./transforms/video');
const slideshow = require('./transforms/slideshow');
const interactiveGraphics = require('./transforms/interactive-graphics');
const infoBox = require('./transforms/info-box');
const contentLinks = require('./transforms/content-links');
const linkAnalytics = require('./transforms/link-analytics');
const removeInvalidLinks = require('./transforms/remove-invalid-links');
const figure = require('./transforms/figure');
const removeImageData = require('./transforms/remove-image-data');
const imagePlaceholder = require('./transforms/image-placeholder');
const subhead = require('./transforms/subhead');

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

module.exports = (body, {
	brightcoveAccountId = process.env.BRIGHTCOVE_ACCOUNT_ID,
	brightcovePlayerId = 'default',
} = {}) => Promise.resolve(body)
	.then(replaceEllipses)
	.then(removeLinkWhitespace)
	.then(articleBody => transformBody(articleBody, {brightcovePlayerId, brightcoveAccountId}));
