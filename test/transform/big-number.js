'use strict';

const {expect} = require('../../test-utils/chai');
const xslt = require('../../server/lib/article-xslt');

describe('big number transform', () => {
	it('should transform custom markup into article-big-number', async () => {
		expect(
			await xslt(`
				<big-number>
					<big-number-intro>Thing</big-number-intro>
					<big-number-headline>1337</big-number-headline>
				</big-number>`, 'main', {})
		).dom.to.equal(`<div class="article-big-number aside--content c-box c-box--inline u-border--all u-padding--left-right">
			<span class="article-big-number__title">1337</span>
			<span class="article-big-number__content">Thing</span>
		</div>`);
	});
});
