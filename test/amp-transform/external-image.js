'use strict';

const {expect} = require('../utils/chai');
const transformBody = require('../../server/lib/transform-body-xml');

describe('external image transform', function() {
	// image service can take a while
	this.timeout(10000);

	it('should transform img to amp-image with ratio', async () => {
		expect(
			// needs to be a real image because we're getting its dimensions from the image service lol
			await transformBody(`<figure class="n-content-image">
				<img src="http://com.ft.imagepublish.prod.s3.amazonaws.com/56f6ad50-da52-11e5-a72f-1e7744c66818"
					longdesc="The blaze at the Make in India relaunch on February 14. The stage that caught fire was made in India"
					alt="The blaze at the Make in India relaunch on February 14. The stage that caught fire was made in India"
					width="600"
					height="350">
				<figcaption class="n-content-image__caption">The blaze at the Make in India relaunch on February 14. The stage that caught fire was
				made in India &#xA9; Getty</figcaption>
			</figure>`)
		).dom.to.equal(`<figure class="article-image article-image--center">
			<div class="article-image__placeholder">
				<amp-img alt="The blaze at the Make in India relaunch on February 14. The stage that caught fire was made in India" src="https://image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2F56f6ad50-da52-11e5-a72f-1e7744c66818?source=google-amp&amp;fit=scale-down&amp;width=500" width="500" height="291.6666666666667" layout="responsive"></amp-img>
			</div>
			<figcaption class="article-image__caption">The blaze at the Make in India relaunch on February 14. The stage that caught fire was made in India © Getty</figcaption>
			</figure>`);
	});
});
