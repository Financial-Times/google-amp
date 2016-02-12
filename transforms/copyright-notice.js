'use strict';

module.exports = function() {

  const thisYear = new Date().getFullYear();
  const copyrightNotice = [
    '<p class="article__copyright-notice"><a href="http://www.ft.com/servicestools/help/copyright" data-trackable="link-copyright">Copyright</a>',
    ` The Financial Times Limited ${thisYear}. You may share using our article tools.`,
    ' Please don\'t cut articles from FT.com and redistribute by email or post to the web.</p>'
  ].join('');

	return copyrightNotice;
};
