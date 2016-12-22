'use strict';

module.exports = $ => $('a[href^="/content"]').forEach((i, element) => {
	$(element).attr('href', (j, href) => `https://www.ft.com${href}`);
});
