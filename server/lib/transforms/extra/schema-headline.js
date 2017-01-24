'use strict';

const validateHeadline = text => {
	if(typeof text !== 'string' || !text.match(/\w/)) return false;

	if(text.length > 110) {
		text = `${text.substr(0, 109)}…`;
	}

	return text;
};

module.exports = contentItem =>
	validateHeadline(contentItem.title) ||
	validateHeadline(contentItem.standfirst) ||
	'Financial Times';
