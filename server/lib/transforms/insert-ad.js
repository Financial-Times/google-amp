'use strict';

const getViableParagraph = require('./get-viable-paragraph');

const secondAdMinPosition = 8;
const adMarkup = () => '<div class="ad-container"><amp-ad width="300" height="250" type="doubleclick"></amp-ad></div>';

module.exports = function insertAd($, options) {
	if(options.enableAds) {
		getViableParagraph($).after(adMarkup(options.targeting));
		if($.root().children('p').length > (secondAdMinPosition + 1)) {
			getViableParagraph($, {getIdeal: () => secondAdMinPosition, minPosition: secondAdMinPosition})
			.after(adMarkup(options.targeting));
		}
	}

	return $;
};
