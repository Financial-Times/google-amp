'use strict';

const updateMessage = (messages, id, message) => {
	id = id.toString();

	if(messages.has(id)) {
		Object.assign(messages.get(id), message);
	} else {
		messages.set(id, message);
	}

	return messages;
};

module.exports = events => Array.from(events.reduce((messages, {event, data}) => {
	switch(event) {
		case 'editmsg':
		case 'msg': {
			return updateMessage(messages, data.mid, data);
		}

		case 'delete': {
			return updateMessage(messages, data.messageid, {deleted: true, mid: data.messageid});
		}

		default: {
			return messages;
		}
	}
}, new Map()).values());
