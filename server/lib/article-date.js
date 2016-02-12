module.exports = contentItem => {
	if (contentItem.publishedDate) {
		return `<time class="header-time" itemprop="datePublished" datetime="2015-09-14 13:00">September 19, 2015</time>`;
	}
};
