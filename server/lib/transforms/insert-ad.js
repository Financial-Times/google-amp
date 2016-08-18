'use strict';

const getViableParagraph = require('./get-viable-paragraph');
const adMarkup = () => '<div class="ad-container"><amp-ad width="300" height="250" type="doubleclick"></amp-ad></div>';

module.exports = function insertAd($, options) {
	getViableParagraph($).after(adMarkup(options.targeting));
	return $;
};
