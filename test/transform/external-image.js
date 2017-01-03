'use strict';

const {expect} = require('../../test-utils/chai');
const transformBody = require('../../server/lib/transform-body');

// Most of this transform is from next-article circa February 2016 so I'm just testing the bits we changed

describe('external image transform', () => {
	it('should transform img to amp-image with ratio', async function() {
		// image service can take a while
		this.timeout(10000);

		expect(
			// needs to be a real image because we're getting its dimensions from the image service lol
			await transformBody('<img src="http://im.ft-static.com/content/images/a60ae24b-b87f-439c-bf1b-6e54946b4cf2.img" width="600" height="337">')
		).dom.to.equal(`<figure class="article-image article-image--center">
			<div class="article-image__placeholder">
				<amp-img alt=""
					src="https://h2.ft.com/image/v1/images/raw/http%3A%2F%2Fim.ft-static.com%2Fcontent%2Fimages%2Fa60ae24b-b87f-439c-bf1b-6e54946b4cf2.img?source=amp&amp;fit=scale-down&amp;width=600"
					width="500"
					height="281.6666666666667"
					layout="responsive"></amp-img>
			</div>
		</figure>`);
	});
});
