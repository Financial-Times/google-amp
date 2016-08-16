'use strict';

const getMiddleParagraph = require('./get-middle-paragraph');
const adMarkup = () => `<div class="ad-container"><amp-ad width="300" height="250" type="doubleclick"></amp-ad></div>`;

module.exports = function insertAd($, options) {
	getMiddleParagraph($).after(adMarkup(options.targeting));
	return $;
};
