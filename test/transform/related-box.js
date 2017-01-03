'use strict';

const {expect} = require('../../test-utils/chai');
const transformBody = require('../../server/lib/transform-body');

// Most of this transform is from next-article circa February 2016 so I'm just testing the bits we changed

describe('related box transform', () => {
	it('should convert api urls to absolute ft.com links', async () => {
		expect(
			await transformBody(`<ft-related type="http://www.ft.com/ontology/content/Article" url="http://api.ft.com/content/a3af7bb8-d63d-11e5-829b-8564e7528e54">
				<headline>Should millennials save £800 a month into pension? Readers respond</headline>
			</ft-related>`)
		).dom.to.equal(`<aside class="c-box c-box--inline u-border--all" data-trackable="related-box" role="complementary">
			<div class="c-box__title">
				<div class="c-box__title-text u-background-color--pink">Related article</div>
			</div>
			<div class="aside--headline u-margin--left-right">
				<a
					data-trackable="link-headline"
					href="http://www.ft.com/content/a3af7bb8-d63d-11e5-829b-8564e7528e54"
					data-vars-link-destination="http://www.ft.com/content/a3af7bb8-d63d-11e5-829b-8564e7528e54"
					data-vars-link-type="related-box"
					data-vars-link-text="Should millennials save 800 a month into pension Readers respond">
					Should millennials save £800 a month into pension? Readers respond
				</a>
			</div>
		</aside>`);
	});
});
