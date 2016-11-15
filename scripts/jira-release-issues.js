#!/usr/bin/env node

'use strict';

const jiraGetReleaseIssues = require('@quarterto/jira-get-release-issues');

jiraGetReleaseIssues(process.argv[2], {
	hostname: process.env.JIRA_HOST,
	project: process.env.JIRA_PROJECT,
	user: process.env.JIRA_USERNAME,
	pass: process.env.JIRA_PASSWORD,
})
.then(r => r.json())
.then(({issues}) =>
	issues.length ?
		issues.map(({key}) => `https://${process.env.JIRA_HOST}/browse/${key}`).join('\n') :
		'None'
).then(
	console.log,
	e => {
		console.error(e.stack);
		process.exit(1);
	}
);
