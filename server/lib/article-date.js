const oDate = require('o-date');

module.exports = (timestamp, classname) => {
	if(timestamp) {
		const date = new Date(timestamp);
		return `<time class="${classname}" itemprop="datePublished" datetime="${date.toISOString()}">${oDate.format(date)}</time>`;
	}
};
