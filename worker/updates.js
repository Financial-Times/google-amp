'use strict';

const kinesisDecoded = require('@quarterto/kinesis-decoded');
const fetch = require('node-fetch');
const assertEnv = require('@quarterto/assert-env');
const logPromise = require('@quarterto/log-promise');
const url = require('url');

const missing = assertEnv.warn(['FASTLY_PURGEKEY', 'FASTLY_HOST']);

const logPurge = ({name, uuid}) => logPromise(
	`purged ${uuid} from ${name}`,
	err => err.message + (err.data ? `\n\n${err.data}` : '')
);

const purgeFastly = async uuid => {
	const purgeUrl = url.format({
		protocol: 'https',
		host: process.env.FASTLY_HOST,
		path: `/content/${uuid}`,
	});

	const response = await fetch(purgeUrl, {
		method: 'PURGE',
		headers: {
			'Fastly-Key': process.env.FASTLY_PURGEKEY,
		},
	});

	if(response.status < 200 || response.status >= 300) {
		const err = new Error(`Failed to purge ${purgeUrl} from Fastly`);

		const data = await response.text();

		try {
			err.data = JSON.parse(data);
		} catch(_) {
			err.data = data;
		}

		throw err;
	}
};

if(missing) {
	console.log(`⤼  ${missing}, not listening for content updates`);
} else {
	const stream = kinesisDecoded({name: 'next-elasticsearch-changelog', region: 'eu-west-1'});

	stream.on('data', data => {
		switch(data.event) {
			case 'UPDATE': {
				console.log(`⟳  received UPDATE for ${data.uuid}`);

				logPurge({
					uuid: data.uuid,
					name: 'Fastly',
				})(purgeFastly(data.uuid));

				break;
			}

			default: {
				console.log(`⤼  skipping ${data.event} event for ${data.uuid}`);
			}
		}
	});

	stream.on('error', e => {
		console.error(e.stack);
	});
}
