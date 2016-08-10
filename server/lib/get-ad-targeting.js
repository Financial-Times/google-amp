'use strict';
const fetch = require('./wrap-fetch.js')(require('node-fetch'), {
	tag: 'getAdTargeting',
});

module.exports = (uuid) => fetch(`https://ads-api.ft.com/v1/content/${uuid}`, {
	timeout: 2000,
})
	.then(response => response.json())
	.then(response => {
		const data = {};
		data.slot = `/5887/ft.com/${response.dfpSite}`;
		if(response.dfpZone) {
			data.slot += `/${response.dfpZone}`;
		}
		return data;
	});
