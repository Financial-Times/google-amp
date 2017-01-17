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

	describe.skip('emoticons', () => {
		it('should give standalone emoticons a class', async () => {
			expect(
				await transformBody('<img src="https://ftalphaville-wp.ft.com/wp-content/plugins/wp-plugin-ft-web-chat/img/emoticons/omg_smile.gif" class="emoticon webchat-emoticon-">')
				).dom.to.equal(`<figure class="article-image article-image--emoticon">
				<amp-img alt=""
				src="https://image.webservices.ft.com/v1/images/raw/https%3A%2F%2Fftalphaville-wp.ft.com%2Fwp-content%2Fplugins%2Fwp-plugin-ft-web-chat%2Fimg%2Femoticons%2Fomg_smile.gif?source=google-amp&amp;fit=scale-down&amp;width=700"
				width="16" height="16"
				layout="fixed"></amp-img>
				</figure>`);
		});

		it('should normalise emoticon urls', async () => {
			expect(
				await transformBody('<img src="https://ftalphaville.ft.com/wp-content/plugins/assanka_web_chat/img/emoticons/omg_smile.gif" class="emoticon webchat-emoticon-">')
			).dom.to.equal(`<figure class="article-image article-image--emoticon">
				<amp-img alt=""
				src="https://image.webservices.ft.com/v1/images/raw/https%3A%2F%2Fftalphaville-wp.ft.com%2Fwp-content%2Fplugins%2Fwp-plugin-ft-web-chat%2Fimg%2Femoticons%2Fomg_smile.gif?source=google-amp&amp;fit=scale-down&amp;width=700"
				width="16" height="16"
				layout="fixed"></amp-img>
				</figure>`);

			expect(
				await transformBody('<img src="/wp-content/plugins/assanka_web_chat/img/emoticons/omg_smile.gif" class="emoticon webchat-emoticon-">')
			).dom.to.equal(`<figure class="article-image article-image--emoticon">
				<amp-img alt=""
				src="https://image.webservices.ft.com/v1/images/raw/https%3A%2F%2Fftalphaville-wp.ft.com%2Fwp-content%2Fplugins%2Fwp-plugin-ft-web-chat%2Fimg%2Femoticons%2Fomg_smile.gif?source=google-amp&amp;fit=scale-down&amp;width=700"
				width="16" height="16"
				layout="fixed"></amp-img>
				</figure>`);
		});

		it('shouldn\'t move emoticons out of paragraphs with text', async () => {
			expect(
				await transformBody(`<p>
					lorem ipsum
					<img src="https://ftalphaville-wp.ft.com/wp-content/plugins/wp-plugin-ft-web-chat/img/emoticons/omg_smile.gif" class="emoticon webchat-emoticon-">
					dolor sit amet
					</p>`)
			).dom.to.equal(`<p>
				lorem ipsum
				<amp-img alt=""
				src="https://image.webservices.ft.com/v1/images/raw/https%3A%2F%2Fftalphaville-wp.ft.com%2Fwp-content%2Fplugins%2Fwp-plugin-ft-web-chat%2Fimg%2Femoticons%2Fomg_smile.gif?source=google-amp&amp;fit=scale-down&amp;width=700"
				width="16" height="16"
				layout="fixed"></amp-img>
				dolor sit amet
				</div>`);
		});
	});
});
