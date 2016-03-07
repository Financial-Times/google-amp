'use strict';
const oDate = require('o-date');

module.exports = (timestamp, classname) => {
	if(timestamp) {
		const date = new Date(timestamp);
		const iso = date.toISOString();
		const formatted = oDate.format(date);
		return `<time class="${classname}" itemprop="datePublished" datetime="${iso}">${formatted}</time>`;
	}
};
