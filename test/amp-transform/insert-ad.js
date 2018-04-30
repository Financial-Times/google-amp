'use strict';

const {expect} = require('../utils/chai');
const bodyTransform = require('../../lib/transforms/body');

describe('insert ad transform', () => {
	it('should add an ad after the 3rd paragraph', async () => {
		const body = `
			<p>First paragraph</p>
			<p>Second paragraph</p>
			<p>Third paragraph</p>
			<p>Fourth paragraph</p>
		`;

		expect(
			await bodyTransform(body, {enableAds: true})
		).dom.to.equal(`
			<p>First paragraph</p>
			<p>Second paragraph</p>
			<p>Third paragraph</p>
			<div class="ad-container"><amp-ad width="300" height="250" type="doubleclick"></amp-ad></div>
			<p>Fourth paragraph</p>
		`);
	});
});
