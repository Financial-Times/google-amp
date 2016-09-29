'use strict';

// const transformArticle = require('../transform-article');

module.exports = (article, catchup, options) => {
	const messages = catchup.filter(({event}) => event === 'msg');
	article.bodyXML = `<ul>${messages.map(({data}) => `<li>${data.textrendered}`).join('\n')}</ul>`;
	return article;
};
