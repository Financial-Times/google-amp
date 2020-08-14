'use strict';

const describeFolder = require('@quarterto/mocha-describe-folder');

describeFolder('lib tests', function () {
	this.timeout(5000);
});
