'use strict';
module.exports = function(body) {
	return body.replace(/ \. \. \. /g, ' &#8230; ')
		.replace(/\. \. \./g, '&#8230;');
};
