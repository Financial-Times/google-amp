'use strict';

const groupBy = require('lodash.groupby');
const keyBy = require('lodash.keyby');
const values = require('lodash.values');
const orderBy = require('lodash.orderby');

module.exports = (events, config) => {
	const {
		msg = [],
		editmsg: edits = [],
		delete: deletes = [],
		postSaved: postUpdates = [],
	} = groupBy(events, 'event');

	const messages = keyBy(msg.map(({data}) => data), 'mid');

	edits.forEach(({data}) => {
		Object.assign(messages[data.mid], data);
	});

	deletes.forEach(({data}) => {
		Object.assign(messages[data.messageid], {deleted: true});
	});

	// TODO: amp-live-list currently only supports new messages at the top
	// https://github.com/ampproject/amphtml/issues/5396
	const sortOrder = config.content_order === 'descending' || true ? 'desc' : 'asc';

	return {
		messages: orderBy(values(messages), 'emb', sortOrder),
		postUpdated: config.content_order === 'descending' ? postUpdates[0] : postUpdates[postUpdates.length - 1],
	};
};
