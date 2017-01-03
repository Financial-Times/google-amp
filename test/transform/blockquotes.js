'use strict';

const {expect} = require('../../test-utils/chai');
const transformBody = require('../../server/lib/transform-body');

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
		expect(
			await transformBody(`<blockquote class="twitter-tweet">
				<a href="https://twitter.com/user/1234">Tweet</a>
			</blockquote>`)
		).dom.to.equal('<amp-twitter width="600" height="250" layout="responsive" data-tweetid="1234"></amp-twitter>');
	});

	it('should transform bare twitter links to amp-twitter elements', async () => {
		expect(
			await transformBody('<a href="https://twitter.com/user/1234">Tweet</a>')
		).dom.to.equal('<amp-twitter width="600" height="250" layout="responsive" data-tweetid="1234"></amp-twitter>');
	});
});
