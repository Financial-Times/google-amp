const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

module.exports = (article, options) => {
	if(options.dev) {
		return true;
	}

	if(/^http:\/\/www.ft.com\/cms\/s\/2/.test(article.webUrl)) {
		return true;
	}

	if(new Date() - new Date(article.publishedDate) > THIRTY_DAYS) {
		return true;
	}

	return false;
};
