var oDate = require('o-date');

module.exports = contentItem => {
	if (contentItem.publishedDate) {
		let date = new Date(contentItem.publishedDate);
		return `<time class="header-time" itemprop="datePublished" datetime="${date.toISOString()}">${oDate.format(date)}</time>`;
	}
};
