'use strict';
const request = require('request');
const RSS = require('rss');
const esQuery = require('../queries/latestContent.js');
const elasticSearchUrl = process.env.ELASTIC_SEARCH_URL;
const aws4 = require('aws4');

var cacheData = '';

module.exports = (req, res) => {
	res.set('Content-Type', 'text/xml');
	res.send(cacheData);
};

var getElasticSearchResults = () => {
	var requestOpts = {
				method: 'POST',
				body: JSON.stringify(esQuery),
				url:  'https://' + elasticSearchUrl + '/v1_api_v2/item/_search'
			};
	
	let opts = {
		host: elasticSearchUrl,
		path: '/v1_api_v2/item/_search',
		method: 'POST',
		body: JSON.stringify(esQuery)	
	};
			
	aws4.sign(opts);
	
	requestOpts.headers = opts.headers;
	
	return new Promise ((resolve, reject) => {
		request(requestOpts, (error, response, body) => {
			if (error || response.statusCode !== 200) {
				reject(error);
			} else {
				resolve(body);
			}
		});	
	});
};

var fetchContent = () => {
	getElasticSearchResults()
		.then(body => {
			let results;
			try {
				results = JSON.parse(body);
			} catch (e) {
				console.log('Couldn\'t parse the JSON');	
			}
			cacheData = generateRssFeed(results);
			console.log('Content updated');
		})
		.catch((error) => {console.log('Failed to fetch the data', error);});
};
//fetchContent();

// setInterval(function() {
// 	fetchContent();
// }, 60000);


var generateRssFeed = data => {
	var feed = new RSS({
		title:'Financial Times',
		description: 'A feed of news for the Google AMP initiative',
		custom_namespaces: {
			content:'http://purl.org/rss/1.0/modules/content/',
				media: 'http://search.yahoo.com/mrss/'
		}
	});
	
	data.hits.hits.forEach(item => {
		let feedItem = {
			title: item.fields['item.title.title'],
			guid: item._id,
			url: item.fields['item.location.uri'],
			date: item.fields['item.lifecycle.initialPublishDateTime'],
			custom_elements: [
				{'content:encoded': item.fields['item.body.body']}
			]
		};
		
		let images = selectAppropriateImages(item.fields.partial1[0].item.images);

		if (images[0]) {
			let img = images[0];
			let rssImg = {
				'media:content': [
					{
						_attr: {
							url: img.url,
							type: 'image/jpeg',
							width: img.width,
							height: img.height
						}
					},
					{
						'media:description': img.caption
					}
				]
			};
			feedItem.custom_elements.push(rssImg);
		}
		feed.item(feedItem);
	});
	return feed.xml();
};

// Image must be bigger than 500px. Filter to correct sizes then sort largest first 
var selectAppropriateImages = imageList => {
	let suitableImages = imageList.filter(image => {
		if (image.width > 500) {
			return image;	
		}
	});
	suitableImages.sort(sortImages);
	return suitableImages;
};

var sortImages = (a, b) => {
	let img = a.width > b.width ? -1 : 1;
	return img;
};
