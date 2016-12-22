'use strict';

const {expect} = require('../../test-utils/chai');
const xslt = require('../../server/lib/article-xslt');

describe('amp links transform', () => {
	it('should add ft.com to /content links', async () => {
		expect(
			await xslt('<a href="/content/uuid">link</a>', 'main', {})
		).dom.to.equal('<a href="https://www.ft.com/content/uuid">link</a>')
	});
});