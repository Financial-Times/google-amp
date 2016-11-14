'use strict';
module.exports = function getCopyrightNotice() {
	const thisYear = new Date().getFullYear();
	const copyrightNotice =
		'<p class="article__copyright-notice"><a href="https://www.ft.com/servicestools/help/copyright" ' +
			'data-vars-link-destination="https://www.ft.com/servicestools/help/copyright" ' +
			`data-vars-link-type="footer-copyright" data-vars-link-text="Copyright">Copyright</a>
			The Financial Times Limited ${thisYear}. All rights reserved.
			Please don't cut articles from FT.com and redistribute by email or post to the web.</p>`;

	return copyrightNotice;
};
