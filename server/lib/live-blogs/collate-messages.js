'use strict';

const groupBy = require('lodash.groupby');
const keyBy = require('lodash.keyby');
const values = require('lodash.values');
const orderBy = require('lodash.orderby');

module.exports = (events, options) => {
	const groups = groupBy(events, 'event');

	const msg = groups.msg || [];
	const edits = groups.editmsg || [];
	const deletes = groups.delete || [];
	const postUpdates = groups.postSaved || [];

	const messages = keyBy(msg.map(({data}) => data), 'mid');

	edits.forEach(({data}) => {
		Object.assign(messages[data.mid], data);
	});

	deletes.forEach(({data}) => {
		if(messages[data.messageid]) {
			Object.assign(messages[data.messageid], {deleted: true});
		} else {
			messages[data.messageid] = {
				mid: data.messageid,
				deleted: true,
				emb: Math.floor(Date.now() / 1000),
				datemodified: Math.floor(Date.now() / 1000),
			};
		}
	});

	// TODO: amp-live-list currently only supports new messages at the top
	// https://github.com/ampproject/amphtml/issues/5396
	const sortOrder = options.content_order === 'descending' || true ? 'desc' : 'asc';

	const sortedMessages = orderBy(values(messages), 'emb', sortOrder);
	const filteredMessages = options.lastUpdate ? sortedMessages.filter(message =>
		!message.datemodified || message.deleted || message.datemodified >= options.lastUpdate
	) : sortedMessages;

	return {
		messages: filteredMessages,
		postUpdated: options.content_order === 'descending' ? postUpdates[0] : postUpdates[postUpdates.length - 1],
	};
};
