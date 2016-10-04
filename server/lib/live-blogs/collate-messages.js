'use strict';

const groupBy = require('lodash.groupby');
const keyBy = require('lodash.keyby');
const values = require('lodash.values');
const orderBy = require('lodash.orderby');

module.exports = (events, config) => {
	const {
		msg,
		editmsg: edits,
		delete: deletes,
	} = groupBy(events, 'event');

	const messages = keyBy(msg.map(({data}) => data), 'mid');

	edits.forEach(({data}) => {
		Object.assign(messages[data.mid], data);
	});

	deletes.forEach(({data}) => {
		Object.assign(messages[data.messageid], {deleted: true});
	});

	return orderBy(values(messages), 'emb', config.content_order === 'descending' ? 'desc' : 'asc');
};
