#!/usr/bin/env node

'use strict';

const {Tasks, deps, logger} = require('@quarterto/log-task');
const assertEnv = require('@quarterto/assert-env');
const pkg = require('../../package.json');
const ReleaseLogClient = require('@financial-times/release-log');
const jiraGetReleaseIssues = require('@quarterto/jira-get-release-issues');

assertEnv(['HEROKU_APP_NAME']);

const {HEROKU_APP_NAME: appName} = process.env;

const env = {
	'ft-google-amp-staging': 'staging',
	'ft-google-amp-prod-eu': 'production',
	'ft-google-amp-prod-us': 'production',
}[appName] || 'dev';

class ReleaseTasks extends Tasks {
	async wrapReleaseLog(_, ...tasks) {
		await deps(
			this.openReleaseLog
		);

		try {
			await deps(...tasks);
			await this.closeReleaseLog();
		} catch(e) {
			await this.closeReleaseLog({
				closeCategory: 'Cancelled',
			});

			throw e;
		}
	}

	async staging() {
		await this.wrapReleaseLog(
			this.githubVersion,
			this.sentryVersion,
			this.vcl
		);
	}

	async production() {
		await this.wrapReleaseLog(
			this.jiraRelease,
			this.vcl
		);
	}

	async dev({log}) {
		log('no release tasks for dev environment');
	}

	async getJiraIssues({log}) {
		assertEnv(['JIRA_HOST', 'JIRA_PROJECT', 'JIRA_USERNAME', 'JIRA_PASSWORD']);

		try {
			const issues = await (await jiraGetReleaseIssues(`google-amp-${pkg.version}`, {
				hostname: process.env.JIRA_HOST,
				project: process.env.JIRA_PROJECT,
				user: process.env.JIRA_USERNAME,
				pass: process.env.JIRA_PASSWORD,
			})).json();

			return issues.map(({key}) => `https://${process.env.JIRA_HOST}/browse/${key}`);
		} catch(e) {
			if(e.data && e.data.errorMessages) {
				log(e.data.errorMessages);
				return [];
			}

			throw e;
		}
	}

	async formatReleaseLogText() {
		const [issues] = await deps(this.getJiraIssues);

		return `JIRA tickets in version ${pkg.version}:
${issues.length ? issues.join('\n') : 'None'}`;
	}

	async getReleaseLogClient() {
		if(this._releaseLogClient) {
			return this._releaseLogClient;
		}

		assertEnv(['KONSTRUCTOR_CR_KEY']);

		this._releaseLogClient = new ReleaseLogClient({
			apiKey: process.env.KONSTRUCTOR_CR_KEY,
		});

		return this._releaseLogClient;
	}

	async openReleaseLog({log}) {
		const [releaseLogClient, changeDescription] = await deps(
			this.getReleaseLogClient,
			this.formatReleaseLogText
		);

		const environment = ({
			production: 'Production',
			staging: 'Test',
			dev: 'Development',
		})[env] || 'Development';

		const {body: {changeRequests: [releaseLog]}} = await releaseLogClient.open({
			summaryOfChange: `Release google-amp ${pkg.version}`,
			ownerEmailAddress: pkg.author,
			resourceOne: pkg.author,
			changeDescription,
			serviceIds: 'amp',
			notify: true,
			notifyChannel: 'apps-tech',
			willThereBeAnOutage: false,
			environment,
		});

		log(`Created release log ${releaseLog.id}`);

		this.releaseLogId = releaseLog.id;
	}

	async closeReleaseLog({log}, {closeCategory = 'Implemented'} = {}) {
		const [releaseLogClient] = await deps(
			this.getReleaseLogClient
		);

		await releaseLogClient.close({
			id: this.releaseLogId,
			closedByEmailAddress: pkg.author,
			closeCategory,
			notify: true,
			notifyChannel: 'apps-tech',
		});

		log(`Closed release log ${this.releaseLogId} as ${closeCategory}`);
	}

	async githubVersion() {}

	async sentryVersion() {}

	async vcl() {}

	async jiraRelease() {}
}

logger.start(`performing release tasks for ${env} app ${appName}`);

ReleaseTasks.run(env).then(
	() => {
		logger.done(`all good, releasing ${pkg.version} to ${appName}`);
	},

	err => {
		logger.log('');
		logger.log(err.stack || err.message || err.toString());
		logger.log('');
		logger.error(`${err.task || 'release tasks'} failed for ${appName}`);
		process.exit(1);
	}
);
