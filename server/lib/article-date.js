var oDate = require('o-date');

module.exports = (timestamp, classname) => {
	if (timestamp) {
		let date = new Date(timestamp);
		return `<time class="${classname}" itemprop="datePublished" datetime="${date.toISOString()}">${oDate.format(date)}</time>`;
	}
};
