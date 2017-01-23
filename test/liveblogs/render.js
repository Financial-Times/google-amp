'use strict';

const {expect} = require('../utils/chai');
const renderLiveBlog = require('../../server/lib/live-blogs/render');

describe('render', () => {
	it('should add status keys to result', () => {
		const rendered = renderLiveBlog({}, {meta: {status: 'inprogress'}, catchup: [], config: {}}, {});
		expect(rendered).to.have.property('liveBlogStatus', 'inprogress');
		expect(rendered).to.have.property('liveBlogStatusLabel', 'Live');
	});
});
