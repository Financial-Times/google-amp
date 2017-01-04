'use strict';

const {expect} = require('../utils/chai');
const transformBody = require('../../server/lib/transform-body-xml');

describe('ft-content transform', () => {
	it('should remove ft-content tags', async () => {
		expect(
			await transformBody('<ft-content></ft-content>')
		).dom.to.equal('');
	});
});
