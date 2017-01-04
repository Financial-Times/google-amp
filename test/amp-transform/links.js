'use strict';

const {expect} = require('../utils/chai');
const transformBody = require('../../server/lib/transform-body-xml');

describe('amp links transform', () => {
	it('should add ft.com to /content links and add tracking attributes', async () => {
		expect(
			await transformBody('<a href="/content/uuid">link</a>')
		).dom.to.equal('<a href="https://www.ft.com/content/uuid" data-vars-link-destination="https://www.ft.com/content/uuid" data-vars-link-type="inline" data-vars-link-text="link">link</a>');
	});

	it('should strip non-href attributes', async () => {
		expect(
			await transformBody('<a href="http://example.com" bar="baz">link</a>')
		).dom.to.equal('<a href="http://example.com" data-vars-link-destination="http://example.com" data-vars-link-type="inline" data-vars-link-text="link">link</a>');
	});
});
