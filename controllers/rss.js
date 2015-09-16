'use strict';
var request = require('request');
var RSS = require('rss');

const elasticSearch = process.env.ELASTIC_SEARCH_URL;

module.exports = (req, res) => {
	getSearchResults()
		.then(body => {
			res.set('Content-Type', 'text/xml');
			res.send(generateFeed(body));
		})
		.catch(() => {res.send('nope');});
};

var getSearchResults = () => {
	var searchRequest = {
				method: 'POST',
				json: true,
				body: esQuery,
				url:  'https://' + elasticSearch + '/v1_api_v2/item/_search'
			};
	
	return new Promise ((resolve, reject) => {
		request(searchRequest, (error, response, body) => {
			if (error || response.statusCode !== 200) {
				reject(error);
			} else {
				resolve(body);
			}
		});	
	});
};

var generateFeed = data => {
	let feed = new RSS({
		title:'Financial Times',
		description: 'A feed of news older than 30 days for the Google AMP initiative',
		custom_namespaces: {
			'content':'http://purl.org/rss/1.0/modules/content/',
			'media': 'http://search.yahoo.com/mrss'
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
		
		let images = generateMediaImage(item.fields.partial1[0].item.images);

		if (images.length > 0) {
			let img = images[0];
			let rssImg = {
				'media:content': [
					{_attr: {
						url: img.url,
						type: img.mediaType,
						width: img.width,
						height: img.height
					}},
					{'media:description': img.caption}
				]
			};
			feedItem.custom_elements.push(rssImg);
		}
		feed.item(feedItem);
	});
	return feed.xml();
};

var generateMediaImage = imageList => {
	return imageList.filter(image => {
		if (image.width > 500) {
			return image;	
		}
	});
};

var searchDate = () => {
	let date = new Date();
	return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;	
};

var esQuery = {
	"fields": ["item.title.title", "item.body.body", "item.lifecycle.initialPublishDateTime", 'item.location.uri'],
	"partial_fields": {
	    "partial1": {
	        "include": "item.images.*"
	    }
	},
	"from":0,
	"size":50,
	"query": {
		"constant_score": {
			"filter": {        
				"range" : {
					"item.lifecycle.initialPublishDateTime" : {
						"lte": searchDate() // replace with new Date() for 24 hrs ago
					}
				}
			}
		}
	},
	"sort": [ // Sorted by date 
        {
            "item.lifecycle.initialPublishDateTime": {
                "order": "desc"
            }
        }
    ]
};