'use strict';

const contentFlags = require('../content/flags');
const extraData = require('../content/extra-data');

module.exports = async (video, options) => {
	video.htmlBody = '';
	video.isVideo = true;

	await contentFlags(video, options);
	await extraData(video, options);
	return video;
};
