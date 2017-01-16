'use strict';

const {expect} = require('../utils/chai');
const transformBody = require('../../server/lib/transform-body-xml');

describe('related box transform', () => {
	it('should tranform next-related-box to old c-box markup', async () => {
		expect(
			await transformBody(`<aside class="n-content-related-box" role="complementary">
				<h3 class="n-content-related-box__title">
					<span class="n-content-related-box__title-text">Special Report</span>
				</h3>
				<div class="n-content-related-box__headline">
					<a href="http://www.ft.com/reports/future-of-the-renminbi">Future of the Renminbi</a>
				</div>
				<div class="n-content-related-box__content">
					<p>The renminbi is at a pivotal moment. Not only is has it become a significant currency for world trade it is also about to be included in the IMF&#x2019;s basket of reserve currencies.</p>
					<p><a href="http://www.ft.com/reports/future-of-the-renminbi">Read more</a></p>
				</div>
			</aside>`)
		).dom.to.equal(`<aside class="c-box c-box--inline u-border--all" data-trackable="related-box" role="complementary">
			<div class="c-box__title">
				<div class="c-box__title-text u-background-color--pink">Special Report</div>
			</div>
			<div class="aside--headline u-margin--left-right">
				<a href="http://www.ft.com/reports/future-of-the-renminbi" data-vars-link-destination="http://www.ft.com/reports/future-of-the-renminbi" data-vars-link-type="related-box" data-vars-link-text="Future of the Renminbi">Future of the Renminbi</a>
			</div>
			<div class="aside--content u-margin--left-right">
				<p>The renminbi is at a pivotal moment. Not only is has it become a significant currency for world trade it is also about to be included in the IMF’s basket of reserve currencies.</p>
				<p><a href="http://www.ft.com/reports/future-of-the-renminbi" data-vars-link-destination="http://www.ft.com/reports/future-of-the-renminbi" data-vars-link-type="related-box" data-vars-link-text="Read more">Read more</a></p>
			</div>
		</aside>`);
	});
});
