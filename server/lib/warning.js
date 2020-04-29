'use strict';

class Warning extends Error {
	constructor (message) {
		super(message);
		this.message = message;
		this.isWarning = true;
		if(Error.captureStackTrace) Error.captureStackTrace(this, Warning);
	}
}

module.exports = Warning;
