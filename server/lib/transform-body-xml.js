'use strict';

const transformBody = require('./transform-body');
const replaceEllipses = require('./xml-transforms/replace-ellipses');
const removeLinkWhitespace = require('./xml-transforms/remove-link-whitespace');
const articleXsltTransform = require('./article-xslt');

const cheerioTransform = transformBody(
	require('./xml-transforms/fix-emoticons'),
	require('./xml-transforms/external-images'),
	require('./xml-transforms/trimmed-links'),
	require('./xml-transforms/remove-styles'),
	require('./xml-transforms/insert-ad'),
	require('./xml-transforms/light-signup'),
	require('./xml-transforms/blockquotes'),
	require('./xml-transforms/replace-tags-with-content'),
	require('./xml-transforms/video'),
	require('./xml-transforms/slideshow'),
	require('./xml-transforms/interactive-graphics'),
	require('./xml-transforms/content-links'),
	require('./xml-transforms/link-analytics'),
	require('./xml-transforms/remove-invalid-links')
);

module.exports = (body, {
	brightcoveAccountId = process.env.BRIGHTCOVE_ACCOUNT_ID,
	brightcovePlayerId = 'default',
} = {}) =>
	articleXsltTransform(body)
		.then(replaceEllipses)
		.then(removeLinkWhitespace)
		.then(articleBody => cheerioTransform(articleBody, {brightcovePlayerId, brightcoveAccountId}));
