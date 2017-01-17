'use strict';

const {expect} = require('../utils/chai');
const transformBody = require('../../server/lib/transform-body-xml');

describe('video transform', () => {
	it('should transform video.ft.com links to amp-brightcove with account and player from parameters', async () => {
		expect(
			await transformBody('<a href="http://video.ft.com/video-id"></a>', {
				brightcoveAccountId: 'account-id',
				brightcovePlayerId: 'player-id',
			})
		).dom.to.equal(`<amp-brightcove
				data-account="account-id"
				data-player="player-id"
				data-embed="default"
				data-video-id="video-id"
				layout="responsive"
				width="480" height="270">
		</amp-brightcove>`);
	});

	describe('youtube', () => {
		it('should transform youtube.com/watch links to amp-youtube', async () => {
			expect(
				await transformBody('<a href="http://youtube.com/watch?v=dQw4w9WgXcQ"></a>')
			).dom.to.equal(`<amp-youtube
				data-videoid="dQw4w9WgXcQ"
				layout="responsive"
				width="480" height="270"></amp-youtube>`);
		});

		it('should transform youtube.com/watch links and unwrap paragraph', async () => {
			expect(
				await transformBody('<p><a href="http://youtube.com/watch?v=dQw4w9WgXcQ"></a></p>')
			).dom.to.equal(`<amp-youtube
				data-videoid="dQw4w9WgXcQ"
				layout="responsive"
				width="480" height="270"></amp-youtube>`);
		});

		it('should transform youtube.com/watch links with videoid not as last parameter', async () => {
			expect(
				await transformBody('<p><a href="http://youtube.com/watch?v=dQw4w9WgXcQ&foo=bar"></a></p>')
			).dom.to.equal(`<amp-youtube
				data-videoid="dQw4w9WgXcQ"
				layout="responsive"
				width="480" height="270"></amp-youtube>`);
		});

		it('should transform video-container divs', async () => {
			expect(
				await transformBody('<div class="video-container video-container-youtube"><div data-asset-ref="dQw4w9WgXcQ"></a></p>')
			).dom.to.equal(`<amp-youtube
				data-videoid="dQw4w9WgXcQ"
				layout="responsive"
				width="480" height="270"></amp-youtube>`);
		});

		it('should transform youtube iframes', async () => {
			expect(
				await transformBody('<iframe frameborder="0" src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>')
			).dom.to.equal(`<amp-youtube
				data-videoid="dQw4w9WgXcQ"
				layout="responsive"
				width="480" height="270"></amp-youtube>`);
		});
	});
});
