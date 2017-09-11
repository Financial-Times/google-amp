#!/usr/bin/env node

const assertEnv = require('@quarterto/assert-env');
const pkg = require('../../package.json');
const symbolLogger = require('@quarterto/symbol-logger');
const {parallel, deps} = require('@quarterto/promise-deps-parallel');

const logger = symbolLogger({
	start: '⬢',
	log: '│',
	done: '✓',
	error: '✗',
});

const taskLogger = name => symbolLogger({
	log: `├─❨${name}❩─`,
}).log;

assertEnv(['HEROKU_APP_NAME']);

const {HEROKU_APP_NAME: appName} = process.env;

const tasks = {
	releaseLog({log}) {
		log('doing a thing');
	},
	githubVersion() {},
	sentryVersion() {},
	vcl() {},
	jiraRelease() {},
};

const envTasks = {
	staging: [
		'releaseLog',
		'githubVersion',
		'sentryVersion',
		'vcl',
	],

	production: [
		'releaseLog',
		'jiraRelease',
		'vcl',
	],

	dev: [],
};

const runTask = name => {
	const start = Date.now();
	logger.log(`starting ${name}`);

	const task = tasks[name];

	if(!task) return Promise.reject(new Error(`no task ${name}`));

	return Promise.resolve(task({
		log: taskLogger(name),
	})).then(
		done('resolve'),
		done('reject')
	);

	function done(andThen) {
		return result => {
			const ms = Date.now() - start;
			logger.log(`${name} took ${ms}ms`);
			return Promise[andThen](result);
		}
	}
}

const env = {
	'ft-google-amp-staging': 'staging',
	'ft-google-amp-prod-eu': 'production',
	'ft-google-amp-prod-us': 'production',
}[appName] || 'dev';

logger.start(`performing release tasks for ${env} app ${appName}`);

Promise.all(
	envTasks[env].map(runTask)
).then(
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
