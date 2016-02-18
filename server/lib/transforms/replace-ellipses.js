'use strict';
module.exports = function(body) {
	return body.replace(/\<p\> \. \. \. \<\/p\>/g, '')
		.replace(/\. \. \./g, '&#8230;');
};
