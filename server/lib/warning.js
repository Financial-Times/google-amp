'use strict';

const util = require('util');

function Warning(message) {
	this.message = message;
	this.isWarning = true;
	Error.call(this);
	if(Error.captureStackTrace) Error.captureStackTrace(this, Warning);
}

util.inherits(Warning, Error);

module.exports = Warning;
