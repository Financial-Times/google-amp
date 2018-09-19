'use strict';

const getContentController = require('./get-content-controller');
const fetchContent = require('../lib/content/fetch');
const transformVideo = require('../lib/video/transform');

module.exports = getContentController({
	fetch: fetchContent({type: 'video'}),
	transform: transformVideo,
	template: 'video',
});
