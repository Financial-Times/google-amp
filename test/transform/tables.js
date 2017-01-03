'use strict';

const {expect} = require('../../test-utils/chai');
const xslt = require('../../server/lib/article-xslt');

describe('tables transform', () => {
	it('should transform single column tables to promo-box', async () => {
		expect(
			await xslt('<table><tr><td>hello</td></tr></table>')
		).dom.to.equal(`<aside class="promo-box c-box u-border--all u-padding--left-right">
			<div class="promo-box__content">hello</div>
		</aside>`);
	});

	it('should add single column table caption as headline', async () => {
		expect(
			await xslt('<table><caption>lorem ipsum</caption><tr><td>hello</td></tr></table>')
		).dom.to.equal(`<aside class="promo-box c-box u-border--all u-padding--left-right">
			<h3 class="promo-box__headline">lorem ipsum</h3>
			<div class="promo-box__content">hello</div>
		</aside>`);
	});
});
