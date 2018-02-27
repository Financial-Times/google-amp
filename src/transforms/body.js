'use strict';

// text-based transforms
const replaceEllipses = require('./text/replace-ellipses');
const removeLinkWhitespace = require('./text/remove-link-whitespace');

const {parseDOM} = require('htmlparser2');
const renderToString = require('@quarterto/preact-render-array-to-string');
const createTransformer = require('@quarterto/markup-components')(require('preact'));

// dom-based transforms
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

module.exports = (body, options = {}) => Promise.resolve(body)
	.then(replaceEllipses)
	.then(removeLinkWhitespace)
	.then(articleBody => parseDOM(articleBody, Object.assign({
		withDomLvl1: true,
		normalizeWhitespace: false,
		xmlMode: false,
		decodeEntities: true,
	}, options)))
	.then(dom => transform(dom, options))
	.then(renderToString);
