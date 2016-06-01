#!/usr/bin/env node
'use strict';

const temp = require('temp').track();
const spawn = require('@quarterto/spawn');

if(!process.env.RECEIVE_DATA) {
	console.log('Not a Heroku automatic deploy, skipping version inference');
	process.exit(0);
}

const herokuReceiveData = JSON.parse(process.env.RECEIVE_DATA);
const parseGithubUrl = url => {
	const m = url.match(/github\.com\/([^\/]+)\/([^\/]+)(?:$|\/)/);
	return m && {
		user: m[1],
		repo: m[2],
	};
};

const gh = parseGithubUrl(herokuReceiveData.deploy_source);
const cloneUrl = `https://github.com/${gh.user}/${gh.repo}.git`;

const dir = temp.mkdirSync('clone');
spawn('git', ['clone', '--bare', cloneUrl, dir]);

const oldDir = process.cwd();
process.chdir(dir);

const mergesResult = spawn('git', ['rev-list', process.env.SOURCE_VERSION, '--merges', '--first-parent']);
const merges = mergesResult.stdout.toString().split('\n').length;
const version = `${merges}.0.0-heroku-${process.env.SOURCE_VERSION.substr(0, 7)}`;

process.chdir(oldDir);

console.log(`inferred version ${version}`);
spawn('npm', ['version', '--git-tag-version=false', version]);
