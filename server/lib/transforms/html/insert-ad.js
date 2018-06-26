'use strict';

const getViableParagraph = require('../utils/get-viable-paragraph');

const adMarkup = (uuid, ftConsentCookie) => {
	let rtcConfig = '';
	if(ftConsentCookie && ftConsentCookie.indexOf('behaviouraladsOnsite:on') !== -1) {
		rtcConfig = `'{"urls":["https://ads-api.ft.com/v1/content/${uuid}?amp=true","https://ads-api.ft.com/v1/user?amp=true", "https://cdn.krxd.net/userdata/v2/amp/HINzStCn?segments_key=ksg&kuid_key=kuid"]}'`;
	}	else {
		rtcConfig = `'{"urls":["https://ads-api.ft.com/v1/content/${uuid}?amp=true","https://ads-api.ft.com/v1/user?amp=true"]}'`;
	}
	return `<div class="ad-container"><amp-ad width="300"	height="250" type="doubleclick"	data-slot="/5887/ft.com/distributed.content/amp.ft" rtc-config=${rtcConfig}></amp-ad></div>`;
};

module.exports = function insertAd($, options) {
	if(options.enableAds) {
		const para = getViableParagraph($);
		if(para) {
			para.after(adMarkup(options.uuid, options.ftConsentCookie));
		}
	}

	return $;
};
