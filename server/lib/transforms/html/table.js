'use strict';

const match = require('@quarterto/cheerio-match-multiple');

function generateTableHref(el, uuid) {
	const tableId = el.attr('id');

	return `https://ft.com/content/${uuid}#${tableId}`;
}

module.exports = match({
	'table'(el, a, b, {uuid}) {
		const href = generateTableHref(el, uuid);

		el.closest('.o-table-container').replaceWith(`<a href="${href}">View the table</a>`);
	},
});
