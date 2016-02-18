const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

module.exports = (article, req) => {
	if(req.app.get('env') === 'development' || req.cookies.amp_article_test) {
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
