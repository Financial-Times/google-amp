'use strict';

const {expect} = require('../utils/chai');
const transformBody = require('../../server/lib/transform-body-xml');

describe('blockquotes transform', () => {
	it('should add classes', async () => {
		expect(
			await transformBody('<blockquote>foo</blockquote>')
		).dom.to.equal(`<blockquote
			class="article__quote article__quote--full-quote aside--content c-box u-border--left u-padding--left-right">
			foo
		</blockquote>`);
	});

	it('should transform twitter link blockquotes to amp-twitter elements', async () => {
		// example uuid b4284269-2951-3169-ab98-88c184da5e88
		expect(
			await transformBody(`<blockquote class="n-content-blockquote n-content-blockquote--tweet twitter-tweet" data-tweet-id="699209637594267648">
				<p>That 98-page Podemos programme for a government with the PSOE in one sentence: We don&apos;t want a government with the PSOE.</p>&#x2014; Tobias Buck (@TobiasBuckFT) <a href="https://twitter.com/TobiasBuckFT/status/699209637594267648">February 15, 2016</a>
				</blockquote>`)
		).dom.to.equal('<amp-twitter width="600" height="250" layout="responsive" data-tweetid="699209637594267648"></amp-twitter>');
	});
});
