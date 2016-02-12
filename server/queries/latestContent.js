module.exports = {
	"fields" : ["item.title.title", "item.lifecycle.initialPublishDateTime", "item.location.uri", "item.body.body"],
	"partial_fields": {
		"partial1": {
			"include": "item.images.*"
		}
	},
	"from":0,
	"size":100,
	"sort": [
		{
			"item.lifecycle.initialPublishDateTime": {
				"order": "desc"
			}
		}
	]
};
