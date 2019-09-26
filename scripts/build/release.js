#!/usr/bin/env node

'use strict';

const {Tasks, deps, logger} = require('@quarterto/log-task');
const assertEnv = require('@quarterto/assert-env');
const githubCreateRelease = require('@quarterto/github-create-release');
const fastlyDeploy = require('@financial-times/fastly-tools/tasks/deploy');

const pkg = require('../../package.json');

assertEnv(['HEROKU_APP_NAME']);

const {HEROKU_APP_NAME: appName} = process.env;

const env = {
	'google-amp-prod-eu': 'production',
	'google-amp-prod-us': 'productionUs',
}[appName] || 'dev';

const [, commit] = pkg.version.match(/([a-f\d]{7})$/) || [];

class ReleaseTasks extends Tasks {
	async production() {
		await deps(
			this.githubVersion,
			this.vcl
		);
	}

	async productionUs({log}) {
		log('no release tasks for prod-us environment');
	}

	async dev({log}) {
		log('no release tasks for dev environment');
	}

	async githubVersion() {
		assertEnv(['GITHUB_RELEASE_REPO', 'GITHUB_RELEASE_USER', 'GITHUB_RELEASE_TOKEN']);

		await githubCreateRelease({
			version: pkg.version,
			commit,
			repository: process.env.GITHUB_RELEASE_REPO,
			user: process.env.GITHUB_RELEASE_USER,
			pass: process.env.GITHUB_RELEASE_TOKEN,
		});
	}

	async vcl() {
		assertEnv(['FASTLY_APIKEY', 'FASTLY_SERVICE']);

		await fastlyDeploy('vcl', {
			service: process.env.FASTLY_SERVICE,
			disableLogs: true,
		});
	}
}

logger.start(`performing release tasks for ${env} app ${appName} v${pkg.version}`);

ReleaseTasks.run(env).then(
	() => {
		logger.done(`all good, releasing v${pkg.version} to ${appName}`);
	},

	err => {
		logger.log('');
		logger.log(err.stack || err.message || err.toString());
		logger.log('');
		logger.error(`${err.task || 'release tasks'} failed for ${appName}`);
		process.exit(1);
	}
);
