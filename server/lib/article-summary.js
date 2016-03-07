'use strict';
module.exports = contentItem => {
	if(contentItem.summaries && contentItem.summaries.length) {
		return contentItem.summaries[0];
	}
};
