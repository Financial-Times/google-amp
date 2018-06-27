'use strict';

const {expect} = require('../utils/chai');
const transformBody = require('../../server/lib/transforms/body');

describe('slideshow transform', () => {
	it('should transform paragraphs that have a slideshow-looking link to ft-slideshow', async () => {
		expect(
			await transformBody('<a href="http://www.ft.com/cms/s/ffffffff-ffff-ffff-ffff-ffffffffffff.html#slide0"></a>')
		).dom.to.equal('<ft-slideshow data-uuid="ffffffff-ffff-ffff-ffff-ffffffffffff"></ft-slideshow>');
	});

	it('should move non-slideshow content in a paragraph into its own paragraph', async () => {
		expect(
			await transformBody(`<p>
				<a href="http://www.ft.com/cms/s/ffffffff-ffff-ffff-ffff-ffffffffffff.html#slide0"></a>
				hello
			</p>`)
		).dom.to.equal('<ft-slideshow data-uuid="ffffffff-ffff-ffff-ffff-ffffffffffff"></ft-slideshow><p>hello</p>');
	});

	it('should not TypeError on el.attr(...).match is not a function or its return value is not iterable', async () => {
		expect(
			await transformBody('<a href="http://www.ft.com/cms/s/0/ffffffff-ffff-ffff-ffff-ffffffffffff.html?siteedition=uk#slide0">port of Sevastopol</a>')
		).dom.to.equal('<ft-slideshow data-uuid="ffffffff-ffff-ffff-ffff-ffffffffffff"></ft-slideshow>');
	});
});
