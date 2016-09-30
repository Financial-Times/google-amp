'use strict';

module.exports = events => events.reduce((messages, {event, data}) => {
	switch(event) {
		case 'editmsg':
		case 'message': {
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
}, new Map());
