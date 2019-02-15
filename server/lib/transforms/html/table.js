'use strict';

const match = require('@quarterto/cheerio-match-multiple');

function generateTableHref(el) {
	const tableId = el.attr('id');
	const contentId = tableId.match(/table-(.*)_\d/)[1];

	return `https://ft.com/content/${contentId}#${tableId}`;
}

module.exports = match({
	'table'(el) {
		const href = generateTableHref(el);

		el.closest('.o-table-container').replaceWith(`<a href="${href}">Go to table</a>`);
	},
});
