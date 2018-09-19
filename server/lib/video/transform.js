'use strict';

const contentFlags = require('../content/flags');
const extraData = require('../content/extra-data');

module.exports = async (video, options) => {
	await contentFlags(video, options);
	await extraData(video, options);
	video.htmlBody = '';

	return video;
};
