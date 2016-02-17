module.exports = contentItem => {
	if (contentItem.summaries && contentItem.summaries.length) {
		return `<p class="standfirst">${contentItem.summaries[0]}</p>`;
	}
};
