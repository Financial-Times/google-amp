module.exports = contentItem => {
	if(contentItem.summaries && contentItem.summaries.length) {
		return `<h2 class="article-standfirst">${contentItem.summaries[0]}</h2>`;
	}
};
