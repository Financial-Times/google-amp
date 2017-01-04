'use strict';

const {expect} = require('../../test-utils/chai');
const transformBody = require('../../server/lib/transform-body');

describe('interactive graphics transform', () => {
	it('should transform to iframe if href is https', async () => {
		expect(
			await transformBody('<a data-asset-type="interactive-graphic" href="https://ig.ft.com/foo" data-width="300" data-height="200">Graphic</a>')
		).dom.to.equal(`<amp-iframe
			src="https://ig.ft.com/foo"
			sandbox="allow-scripts allow-same-origin"
			layout="responsive"
			frameborder="0"
			width="300" height="200">
		</amp-iframe>`);
	});

	it('should strip if href is not https', async () => {
		expect(
			await transformBody('<a data-asset-type="interactive-graphic" href="http://ig.ft.com/foo" data-width="300" data-height="200">Graphic</a>')
		).dom.to.equal('');
	});
});
