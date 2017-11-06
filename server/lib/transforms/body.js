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
// const blockquotes = require('./html/blockquotes');
const replaceTagsWithContent = require('./html/replace-tags-with-content');
const video = require('./html/video');
const unfurlVideo = require('./html/unfurl-video');
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
	video: deps('unfurlVideo')(video),
	externalImages,
	trimmedLinks,
	removeStyles,
	insertAd,
	// blockquotes,
	replaceTagsWithContent,
	unfurlVideo,
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

if(module === require.main) {
	const html = `<article>
		<blockquote data-tweet-id="924920902235688960"></blockquote>

		<blockquote class="n-content-pullquote">
			<div class="n-content-pullquote__content">
				<p>You couldn&#x2019;t just be a P1 company and generate the returns to keep investing
				in new products</p>
				<footer class="n-content-pullquote__footer">Mike Flewitt, chief executive</footer>
			</div>
		</blockquote>
	</article>`;

	const {parseDOM} = require('htmlparser2');
	const renderToString = require('@quarterto/preact-render-array-to-string');
	const createTransformer = require('@quarterto/markup-components')(require('preact'));

	const Tweet = require('./html/tweet')
	const Blockquote = require('./html/blockquotes');


	const dom = parseDOM(html);
	const transform = createTransformer(
		Tweet,
		Blockquote
	);

	console.log(html);
	console.log('----------');

	console.time('processing');

	transform(dom).then(tree => {
		console.timeEnd('processing');
		console.log(renderToString(tree));
	}, err => console.error(err.stack));
}
