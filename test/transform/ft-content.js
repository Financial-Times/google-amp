'use strict';

const {expect} = require('../../test-utils/chai');
const xslt = require('../../server/lib/article-xslt');

describe('ft-content transform', () => {
	it('should remove ft-content tags', async () => {
		expect(
			await xslt('<ft-content></ft-content>', 'main', {})
		).dom.to.equal('');
	});
});
