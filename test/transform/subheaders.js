'use strict';

const {expect} = require('../../test-utils/chai');
const xslt = require('../../server/lib/article-xslt');

describe('subheaders transform', () => {
	it('should transform h3s with ft-subhead class to h2 with classes', async () => {
		expect(
			await xslt('<h3 class="ft-subhead">hello</h3>')
		).dom.to.equal('<h2 class="article__subhead article__subhead--standard">hello</h2>');
	});


	it('should use different classes, add id and unwrap strong if h3 contains strong', async () => {
		expect(
			await xslt('<h3 class="ft-subhead"><strong>hello</strong></h3>')
		).dom.to.equal('<h2 class="article__subhead article__subhead--crosshead" id="crosshead-1">hello</h2>');
	});
});
