'use strict';

const fetch = require('./wrap-fetch.js')('slideshows', require('node-fetch'));
const fetchres = require('fetchres');

const fetchSlideshow = uuid => fetch(`https://api.ft.com/content/items/v1/${uuid}?apiKey=${process.env.API_V1_KEY}`)
.then(fetchres.json)
.then(data => {
	if(data
		&& data.item
		&& data.item.assets
		&& data.item.assets[0]
		&& data.item.assets[0].type === 'slideshow') {
		return {
			uuid,
			title: data.item.assets[0].fields.title,
			slides: data.item.assets[0].fields.slides,
		};
	} else {
		throw Error(404);// @nocommit
	}
});

module.exports = (article) => {
	const promises = [];
	const regex = /href=['"][^'"]+([^'"]{36}).html#slide0['"]/g;

	let match;

	while((match = regex.exec(article.bodyXML))) {
		promises.push(fetchSlideshow(match[1]));
	}

	return Promise.all(promises)
	.then(res => {
		article.slideshows = {};
		res.forEach(slideshow => {
			article.slideshows[slideshow.uuid] = slideshow;
		});
		console.log(article.slideshows);
	})
	.catch(err => console.log(err));// @nocommit
};
