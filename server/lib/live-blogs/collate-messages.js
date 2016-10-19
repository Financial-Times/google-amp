'use strict';

const groupBy = require('lodash.groupby');
const keyBy = require('lodash.keyby');
const values = require('lodash.values');
const orderBy = require('lodash.orderby');

module.exports = (events, options) => {
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
		// deletes can't be filtered by timestamp so it's possible we've got a
		// delete for a message we've filtered
		if(messages[data.messageid]) {
			Object.assign(messages[data.messageid], {deleted: true});
		}
	});

	// TODO: amp-live-list currently only supports new messages at the top
	// https://github.com/ampproject/amphtml/issues/5396
	const sortOrder = options.content_order === 'descending' || true ? 'desc' : 'asc';

	const sortedMessages = orderBy(values(messages), 'emb', sortOrder);
	const filteredMessages = options.lastUpdate ? sortedMessages.filter(message =>
		!message.datemodified || message.datemodified >= options.lastUpdate
	) : sortedMessages;

	return {
		messages: filteredMessages,
		postUpdated: options.content_order === 'descending' ? postUpdates[0] : postUpdates[postUpdates.length - 1],
	};
};
