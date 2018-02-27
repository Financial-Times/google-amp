'use strict';

const {expect} = require('../utils/chai');
const transformBody = require('../../lib/transforms/body');

describe('ft-content transform', () => {
	it('should remove ft-content tags', async () => {
		expect(
			await transformBody('<ft-content>hello</ft-content>')
		).dom.to.equal('');
	});
});
