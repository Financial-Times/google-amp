'use strict';

const cheerioTransform = require('../cheerio-transform');
const fetch = require('../fetch/wrap')(require('node-fetch'), {
	tag: 'slideshows',
});
const fetchres = require('fetchres');
const reportError = require('../report-error');
const Warning = require('../warning');

const slideshowTransform = cheerioTransform(require('../transforms/html/slideshow'));

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
.catch(e => Promise.reject(new Warning(`Failed to fetch slideshow for UUID ${uuid}. Error: [${e.toString()}]`)));

// Run just the slideshow transform to get predictable XML to match with regex
module.exports = (article, options) => {
	article.slideshows = {};

	return slideshowTransform(article.bodyHTML)
	.then(bodyHTML => {
		const uuidMatch = '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}';
		const regex = new RegExp(`<ft-slideshow data-uuid="(${uuidMatch})"></ft-slideshow>`, 'g');

		const promises = [];
		let match = regex.exec(bodyHTML);
		while(match) {
			promises.push(fetchSlideshow(match[1]));
			match = regex.exec(bodyHTML);
		}

		return Promise.all(promises)
			.then(res => {
				res.forEach(slideshow => {
					article.slideshows[slideshow.uuid] = slideshow;
				});
			})
			.catch(e => reportError(options.raven, e));
	});
};
