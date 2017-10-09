#!/usr/bin/env node

'use strict';

const {Tasks, deps, logger} = require('@quarterto/log-task');
const assertEnv = require('@quarterto/assert-env');
const ReleaseLogClient = require('@financial-times/release-log');
const jiraGetReleaseIssues = require('@quarterto/jira-get-release-issues');
const jiraMergeUnreleasedVersions = require('jira-merge-unreleased-versions');
const sentryCreateRelease = require('@quarterto/sentry-create-release');
const githubCreateRelease = require('@quarterto/github-create-release');
const fastlyDeploy = require('@financial-times/fastly-tools/tasks/deploy');

const pkg = require('../../package.json');

assertEnv(['HEROKU_APP_NAME']);

const {HEROKU_APP_NAME: appName} = process.env;

const env = {
	'ft-google-amp-staging': 'staging',
	'ft-google-amp-prod-eu': 'production',
	'ft-google-amp-prod-us': 'production',
}[appName] || 'dev';

const [, commit] = pkg.version.match(/([a-f\d]{7})$/) || [];

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
			const {issues} = await (await jiraGetReleaseIssues(`google-amp-${pkg.version}`, {
				hostname: process.env.JIRA_HOST,
				project: process.env.JIRA_PROJECT,
				user: process.env.JIRA_USERNAME,
				pass: process.env.JIRA_PASSWORD,
			})).json() || [];

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
			summaryOfChange: `Release google-amp ${pkg.version} to ${appName}`,
			ownerEmailAddress: pkg.author,
			resourceOne: pkg.author,
			changeDescription,
			serviceIds: 'google amp',
			notify: true,
			notifyChannel: env === 'production' ? 'ft-tech-incidents' : 'apps-tech',
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
			notifyChannel: env === 'production' ? 'ft-tech-incidents' : 'apps-tech',
		});

		log(`Closed release log ${this.releaseLogId} as ${closeCategory}`);
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

	async sentryVersion() {
		assertEnv(['SENTRY_RELEASE_HOOK']);

		await sentryCreateRelease({
			sentryReleaseHook: process.env.SENTRY_RELEASE_HOOK,
			version: pkg.version,
			commit,
		});
	}

	async vcl() {
		assertEnv(['FASTLY_APIKEY', 'FASTLY_SERVICE']);

		await fastlyDeploy('vcl', {
			service: process.env.FASTLY_SERVICE,
			disableLogs: true,
		});
	}

	async jiraRelease({log}) {
		assertEnv(['JIRA_HOST', 'JIRA_PROJECT', 'JIRA_USERNAME', 'JIRA_PASSWORD']);

		const {unreleased, latestUnreleased} = await jiraMergeUnreleasedVersions({
			packageName: pkg.name,
			hostname: process.env.JIRA_HOST,
			project: process.env.JIRA_PROJECT,
			user: process.env.JIRA_USERNAME,
			pass: process.env.JIRA_PASSWORD,
		});

		if(unreleased.length === 1) {
			log(`merged 1 version into ${latestUnreleased.name} and set it as released`);
		} else if(unreleased.length) {
			log(`merged ${unreleased.length} versions into ${latestUnreleased.name} and set it as released`);
		} else {
			log(`set ${latestUnreleased.name} as released`);
		}
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
