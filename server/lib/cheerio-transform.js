'use strict';
const cheerio = require('cheerio');

const replaceEllipses = require('./transforms/replace-ellipses');
const trimmedLinks = require('./transforms/trimmed-links');
const externalImages = require('./external-images');
const copyrightNotice = require('./transforms/copyright-notice');
const lightSignup = require('./transforms/light-signup');

function removeStyleAttributes($) {
	$('[style]').each(function eachStyle() {
		$(this).removeAttr('style');
	});

	return $;
}

module.exports = function run(body, flags, adTargeting) {
	body = replaceEllipses(body);
	body = body.replace(/<\/a>\s+([,;.:])/mg, '</a>$1');
	body = body.concat(copyrightNotice());

	const $ = cheerio.load(body, {decodeEntities: false});
	const paragraph = $('p').eq(3);
	paragraph.after(`
					<amp-ad width="300"
						height="250"
						type="doubleclick"
						data-slot="${adTargeting.slot}"
						json="{&#34;targeting&#34;:{&#34;pos&#34;: &#34;mpu&#34;}}">
						<div placeholder>
								<b>Placeholder here!!!</b>
						</div>
				</amp-ad>
	`);

	return Promise.all([
		externalImages,
		trimmedLinks,
		removeStyleAttributes,
		lightSignup,
	].map(transform => transform($, flags)))
		.then(() => $);
};
