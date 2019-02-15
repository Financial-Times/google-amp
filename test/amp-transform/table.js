'use strict';

const {expect} = require('../utils/chai');
const transformBody = require('../../server/lib/transforms/body');

describe('table transform', () => {
	it('should replace table with link', async () => {
		const tableId = 'table-00000000-000-0000-0000-000000000000_2';
		const tableHtml = `
			<div class="o-table-container o-table-container--contracted">
				<div class="o-table-overlay-wrapper">
					<div class="o-table-scroll-wrapper">
						<table id="${tableId}"></table>
					</div>
				</div>
			</div>
		`;
		expect(
			await transformBody(tableHtml)
		).dom.to.equal(
			`<a href="https://ft.com/content/00000000-000-0000-0000-000000000000#${tableId}">Go to table</a>`
		);
	});
});
