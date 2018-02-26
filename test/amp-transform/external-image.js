'use strict';

const {expect} = require('../utils/chai');
const transformBody = require('../../lib/transforms/body');
const nock = require('nock');

const imageResponse = require('../fixtures/56f6ad50-da52-11e5-a72f-1e7744c66818.json');

describe('external image transform', () => {
	let imageService;

	beforeEach(() => {
		imageService = nock('https://www.ft.com')
			.get(/\/__origami\/service\/image\/v2\/images\/metadata\//)
			.reply(200, imageResponse);
	});

	afterEach(() => {
		nock.cleanAll();
	});

	it('should transform img to amp-image with ratio', async () => {
		expect(
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
				<amp-img alt="The blaze at the Make in India relaunch on February 14. The stage that caught fire was made in India" src="https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2F56f6ad50-da52-11e5-a72f-1e7744c66818?source=google-amp&amp;fit=scale-down&amp;width=500" width="500" height="291.6666666666667" layout="responsive"></amp-img>
			</div>
			<figcaption class="article-image__caption">The blaze at the Make in India relaunch on February 14. The stage that caught fire was made in India © Getty</figcaption>
			</figure>`);

		imageService.isDone();
	});
});
