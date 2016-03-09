'use strict';

const articleXsltTransform = require('../../bower_components/next-article/server/transforms/article-xslt');
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
	}

	throw Error(`No slideshow found in assets for UUID ${uuid}`);
})
.catch(e => Promise.reject(Error(`Failed to fetch slideshow for UUID ${uuid}. Error: [${e.toString()}]`)));

// Run just the slideshow transform to get predictable XML to match with regex
module.exports = (article, options) => articleXsltTransform(article.bodyXML, 'slideshow-only', {})
	.then(bodyXML => {
		const uuidMatch = '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}';
		const regex = new RegExp(`<ft-slideshow data-uuid="(${uuidMatch})"></ft-slideshow>`, 'g');

		const promises = [];
		let match = regex.exec(bodyXML);
		while(match) {
			promises.push(fetchSlideshow(match[1]));
			match = regex.exec(bodyXML);
		}

		return Promise.all(promises)
		.then(res => {
			article.slideshows = {};
			res.forEach(slideshow => {
				article.slideshows[slideshow.uuid] = slideshow;
			});
		})
		.catch(e => options.raven && options.raven.captureException(e) || console.log(e));
	});