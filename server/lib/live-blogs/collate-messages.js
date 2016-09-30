'use strict';

module.exports = events => Array.from(events.reduce((messages, {event, data}) => {
	switch(event) {
		case 'editmsg':
		case 'msg': {
			return messages.set(data.mid, data);
		}

		case 'delete': {
			if(messages.has(data.messageid)) {
				messages.get(data.messageid).deleted = true;
			} else {
				messages.set(data.messageid, {deleted: true});
			}

			return messages;
		}

		default: {
			return messages;
		}
	}
}, new Map()).values());
