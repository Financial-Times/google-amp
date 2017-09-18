#!/usr/bin/env node

'use strict';

const {Tasks, deps, logger} = require('@quarterto/log-task');
const assertEnv = require('@quarterto/assert-env');
const pkg = require('../../package.json');

assertEnv(['HEROKU_APP_NAME']);

const {HEROKU_APP_NAME: appName} = process.env;

class ReleaseTasks extends Tasks {
	async staging() {
		await deps(this.releaseLog, this.githubVersion, this.sentryVersion, this.vcl);
	}

	async production() {
		await deps(this.releaseLog, this.githubVersion, this.sentryVersion, this.vcl);
	}

	async dev({log}) {
		log('no release tasks for dev environment');
	}

	async releaseLog({log}) {
		log('doing a thing');
	}

	async githubVersion() {}

	async sentryVersion() {}

	async vcl() {}

	async jiraRelease() {}
}

const env = {
	'ft-google-amp-staging': 'staging',
	'ft-google-amp-prod-eu': 'production',
	'ft-google-amp-prod-us': 'production',
}[appName] || 'dev';

logger.start(`performing release tasks for ${env} app ${appName}`);

ReleaseTasks.run(env).then(
	() => {
		logger.done(`all good, releasing ${pkg.version} to ${appName}`);
	},

	err => {
		logger.log('');
		logger.log(err.stack);
		logger.log('');
		logger.error(`release tasks failed for ${appName}`);
		process.exit(1);
	}
);
