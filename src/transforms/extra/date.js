'use strict';

const oDate = require('o-date');

const now = new Date();
const midnightToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

module.exports = (timestamp, {classname, format = 'datetime'}) => {
	if(timestamp) {
		const date = new Date(timestamp);
		const iso = date.toISOString();

		if(format === 'datetimeortime') {
			if(date >= midnightToday) {
				format = 'HH:mm a';
			} else {
				format = 'datetime';
			}
		}

		const formatted = oDate.format(date, format);
		return `<time class="${classname}" itemprop="datePublished" datetime="${iso}">${formatted}</time>`;
	}
};
