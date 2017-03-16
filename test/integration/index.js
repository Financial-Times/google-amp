'use strict';

const describeFolder = require('@quarterto/mocha-describe-folder');

describeFolder('integration tests', () => {
	before(function() {
		this.timeout(5000);
	});
});
