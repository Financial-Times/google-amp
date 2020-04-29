
// we usually skip particular articles because they contain dynamic images,
// which shouldn't be cached, but we've got no control over how AMP caches them
const articlesToSkip = [
	'263615ca-d873-11e9-8f9b-77216ebe1f17', // UK 2019 general election poll tracker
	'f3bb0944-4437-11ea-abea-0c7a29cd66fe', // US 2019 democratic primaries delegate tracker
	'a26fbf7e-48f8-11ea-aeb3-955839e06441', // Coronavirus tracker map
	'0c13755a-6867-11ea-800d-da70cff6e4d3', // Coronavirus economic tracker page
];

module.exports = article => {
	// don't display AMP for articles from agencies
	if(article.originatingParty !== 'FT') {
		return true;
	}

	// skip non-article content, e.g. packages
	if(article.type !== 'article') {
		return true;
	}

	// skip articles we've explicitly listed above
	if(articlesToSkip.includes(article.id)) {
		return true;
	}

	return false;
};

