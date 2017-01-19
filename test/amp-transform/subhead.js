'use strict';

const {expect} = require('../utils/chai');
const transformBody = require('../../server/lib/transform-body');

describe('subhead transform', () => {
	it('should replace subhead classes', async () => {
		expect(
			await transformBody('<h2 class="subhead subhead--standard">hello</h2>')
		).dom.to.equal('<h2 class="article__subhead article__subhead--standard">hello</h2>');
	});

	it('should replace crosshead classes', async () => {
		expect(
			await transformBody('<h2 class="subhead subhead--crosshead">hello</h2>')
		).dom.to.equal('<h2 class="article__subhead article__subhead--crosshead">hello</h2>');
	});
});
