'use strict';

const {expect} = require('../utils/chai');
const transformBody = require('../../lib/transforms/body');

describe('info box transform', () => {
	it('should transform next info-box to old c-box markup', async () => {
		expect(await transformBody(`<aside class="n-content-info-box">
			<h3 class="n-content-info-box__headline">Driven by choice</h3>
			<div class="n-content-info-box__content">
					<p>There are about 8,000 McLarens on the road today &#x2014; a small fraction of the global market, which adds 80m new cars a year.</p>
			</div>
		</aside>`)).dom.to.equal(`<aside class="promo-box c-box u-border--all u-padding--left-right">
			<h3 class="promo-box__headline">Driven by choice</h3>
			<div class="promo-box__content">
				<p>There are about 8,000 McLarens on the road today — a small fraction of the global market, which adds 80m new cars a year.</p>
			</div>
		</aside>`);
	});
});
