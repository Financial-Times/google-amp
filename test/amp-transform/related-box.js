'use strict';

const {expect} = require('../utils/chai');
const transformBody = require('../../server/lib/transform-body');

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

	it('should tranform aside image links properly', async () => {
		expect(
			await transformBody(`<aside class="n-content-related-box" role="complementary">
				<a class="n-content-related-box__image-link" href="/content/0a5e1620-c0f5-11e5-846f-79b0e3d20eaf">
					<img src="http://com.ft.imagepublish.prod.s3.amazonaws.com/9a0e5ade-c0f8-11e5-9fdb-87b8d15baec2" alt="A man walks past a logo of a Foxconn factory in Wuhan, Hubei province, August 31, 2012" width="2048" height="1152" data-copyright="&#xA9; Reuters">
				</a>
			</aside>`)
		).dom.to.equal(`<aside class="c-box c-box--inline u-border--all" data-trackable="related-box" role="complementary">
			<div class="aside--image">
				<a data-trackable="link-image" href="https://www.ft.com/content/0a5e1620-c0f5-11e5-846f-79b0e3d20eaf" data-vars-link-destination="https://www.ft.com/content/0a5e1620-c0f5-11e5-846f-79b0e3d20eaf" data-vars-link-type="related-box">
					<div class="article-image__placeholder">
						<amp-img alt="A man walks past a logo of a Foxconn factory in Wuhan, Hubei province, August 31, 2012" src="https://image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2F9a0e5ade-c0f8-11e5-9fdb-87b8d15baec2?source=google-amp&amp;fit=scale-down&amp;width=470" width="470" height="264.375" layout="responsive"></amp-img>
					</div>
				</a>
			</div>
		</aside>`);
	});
});
