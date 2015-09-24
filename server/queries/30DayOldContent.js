'use strict';
module.exports =  {
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
						"lte": searchDate()
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

var searchDate = () => {
	let date = new Date();
	return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;	
};