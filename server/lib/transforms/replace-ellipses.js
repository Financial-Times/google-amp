'use strict';
module.exports = function replaceEllipses(body) {
	return body.replace(/\<p\>\u2009\.\u2009\.\u2009\.\u2009\<\/p\>/g, '')
		.replace(/\. \. \./g, '&#8230;');
};
