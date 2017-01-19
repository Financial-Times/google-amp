'use strict';

const {expect} = require('../utils/chai');
const transformBody = require('../../server/lib/transform-body');

describe('amp links transform', () => {
	it('should add ft.com to /content links and add tracking attributes', async () => {
		expect(
			await transformBody('<a href="/content/uuid">link</a>')
		).dom.to.equal('<a href="https://www.ft.com/content/uuid" data-vars-link-destination="https://www.ft.com/content/uuid" data-vars-link-type="inline" data-vars-link-text="link">link</a>');
	});
});
