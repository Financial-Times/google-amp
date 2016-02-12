module.exports = contentItem => {
	let summaryMarkup = '';
	if (contentItem.summaries) {
		summaryMarkup = `<p class="standfirst">${contentItem.summaries[0]}</p>`;
	}
	return summaryMarkup;
};
