'use strict';

const {expect} = require('../../test-utils/chai');
const xslt = require('../../server/lib/article-xslt');

describe('pull quotes transform', () => {
	it('should transform to blockquote', async () => {
		expect(
			await xslt(`<pull-quote>
				<pull-quote-text>Lorem ipsum dolor sit amet</pull-quote-text>
				<pull-quote-source>Winston Churchill</pull-quote-source>
			</pull-quote>`)
		).dom.to.equal(`<blockquote
			class="article__quote article__quote--pull-quote aside--content c-box c-box--inline u-border--all">
			<div class="pull-quote__quote-marks"></div>
			<div class="u-padding--left-right">
				<p>Lorem ipsum dolor sit amet</p>
				<footer class="article__quote-footer">
					Winston Churchill
				</footer>
			</div>
		</blockquote>`);
	});

	it('should transform pullquote image and add classes', async () => {
		// see also amp-related-box.js and external-image.js
		expect(
			await xslt(`<pull-quote>
				<pull-quote-image><img src="https://www.example.com/foo.jpg" width="400" height="200" alt="foo"></pull-quote-image>
				<pull-quote-text>Lorem ipsum dolor sit amet</pull-quote-text>
				<pull-quote-source>Winston Churchill</pull-quote-source>
			</pull-quote>`)
		).dom.to.equal(`<blockquote
			class="article__quote article__quote--pull-quote aside--content c-box c-box--inline u-border--all u-padding--bottom-none">
			<div class="pull-quote__quote-marks"></div>
			<div class="u-padding--left-right u-padding--bottom">
				<p>Lorem ipsum dolor sit amet</p>
				<footer class="article__quote-footer">
					Winston Churchill
				</footer>
			</div>
			<div class="aside--image u-margin--left-right">
				<div class="article-image__placeholder">
					<amp-img alt="foo" src="https://h2.ft.com/image/v1/images/raw/https://www.example.com/foo.jpg?source=amp&amp;fit=scale-down&amp;width=400" width="400" height="200" layout="responsive">
					</amp-img>
				</div>
			</div>
		</blockquote>`);
	});
});
