'use strict';

const getViableParagraph = require('../utils/get-viable-paragraph');

const adMarkup = uuid => `
	<div class="ad-container">
		<amp-ad
			width="300"
			height="250"
			type="doubleclick"
			data-slot="/5887/ft.com/distributed.content/amp.ft"
			rtc-config='{"urls": [
				"https://ads-api.ft.com/v1/content/${uuid}?amp=true",
				"https://ads-api.ft.com/v1/user?amp=true",
			]}'>
			
		</amp-ad>
	</div>`;

module.exports = function insertAd($, options) {
	if(options.enableAds) {
		console.log(options);
		getViableParagraph($).after(adMarkup(options.uuid));
	}

	return $;
};
