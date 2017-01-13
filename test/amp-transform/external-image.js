'use strict';

const {expect} = require('../utils/chai');
const transformBody = require('../../server/lib/transform-body-xml');

// Most of this transform is from next-article circa February 2016 so I'm just testing the bits we changed

describe('external image transform', function() {
	// image service can take a while
	this.timeout(10000);

	it('should transform img to amp-image with ratio', async () => {
		expect(
			// needs to be a real image because we're getting its dimensions from the image service lol
			await transformBody('<img src="http://im.ft-static.com/content/images/a60ae24b-b87f-439c-bf1b-6e54946b4cf2.img" width="600" height="337">')
		).dom.to.equal(`<figure class="article-image article-image--center">
			<div class="article-image__placeholder">
				<amp-img alt=""
					src="https://image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fim.ft-static.com%2Fcontent%2Fimages%2Fa60ae24b-b87f-439c-bf1b-6e54946b4cf2.img?source=google-amp&amp;fit=scale-down&amp;width=600"
					width="500"
					height="281.3786008230453"
					layout="responsive"></amp-img>
			</div>
		</figure>`);
	});

	describe('emoticons', () => {
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
