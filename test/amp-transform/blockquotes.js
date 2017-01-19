'use strict';

const {expect} = require('../utils/chai');
const transformBody = require('../../server/lib/transform-body');

describe('blockquotes transform', () => {
	it('should add classes and quotes to pullquotes', async () => {
		expect(
			await transformBody(`<blockquote class="n-content-pullquote">
				<div class="n-content-pullquote__content">
					<p>You couldn&#x2019;t just be a P1 company and generate the returns to keep investing
					in new products</p>
					<footer class="n-content-pullquote__footer">Mike Flewitt, chief executive</footer>
				</div>
			</blockquote>`)
			).dom.to.equal(`<blockquote class="article__quote article__quote--pull-quote aside--content c-box c-box--inline u-border--all">
				<div class="pull-quote__quote-marks"></div>
				<div class="u-padding--left-right">
					<p>You couldn&#x2019;t just be a P1 company and generate the returns to keep investing
					in new products</p>
					<footer class="article__quote-footer">Mike Flewitt, chief executive</footer>
				</div>
			</blockquote>`);
	});

	it('should add classes to bare blockquotes', async () => {
		expect(
			await transformBody(`<blockquote>
				<p>You couldn&#x2019;t just be a P1 company and generate the returns to keep investing
					in new products</p>
			</blockquote>`)
			).dom.to.equal(`<blockquote class="article__quote article__quote--full-quote aside--content c-box u-border--left u-padding--left-right">
				<p>You couldn&#x2019;t just be a P1 company and generate the returns to keep investing
					in new products</p>
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
