'use strict';

const adMarkup = () => `<div class="ad-container"><amp-ad width="300" height="250" type="doubleclick"></amp-ad></div>`;

module.exports = function insertAd($, options) {
		const paragraph = $('p').eq(3);
		paragraph.after(adMarkup(options.targeting));
	return $;
};