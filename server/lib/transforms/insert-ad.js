'use strict';

const adMarkup = ({slot}) => `<amp-ad width="300"
		height="250"
		type="doubleclick"
		data-slot="${slot}"
		json="{&#34;targeting&#34;:{&#34;pos&#34;: &#34;mpu&#34;}}">
		<div placeholder>
				<b>Placeholder here!!!</b>
		</div>
</amp-ad>`;

module.exports = function insertAd($, options) {
	if(options.targeting) {
		const paragraph = $('p').eq(3);
		paragraph.after(adMarkup(options.targeting));
	}

	return $;
};
