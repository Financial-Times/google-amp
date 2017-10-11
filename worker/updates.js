'use strict';

const kinesisDecoded = require('@quarterto/kinesis-decoded');
const fetch = require('node-fetch');
const assertEnv = require('@quarterto/assert-env');
const logPromise = require('@quarterto/log-promise');
const url = require('url');
const util = require('util');

const missing = assertEnv.warn(['FASTLY_PURGEKEY', 'FASTLY_HOST']);

const logPurge = ({name, uuid}) => logPromise(
	` purged ${uuid} from ${name}`,
	err => ` ${err.message} from ${name}${(err.data ? `\n\n${util.inspect(err.data)}` : '')}`
);

const purgeUrl = uuid => url.format({
	protocol: 'https',
	host: process.env.FASTLY_HOST,
	path: `/content/${uuid}`,
});

const handleResponse = async response => {
	if(response.status < 200 || response.status >= 300) {
		const err = new Error(`failed to purge ${purgeUrl}`);

		const data = await response.text();

		try {
			err.data = JSON.parse(data);
		} catch(_) {
			err.data = data;
		}

		throw err;
	}

	return response;
};

const purgeFastly = async uuid => {
	const response = await fetch(purgeUrl(uuid), {
		method: 'PURGE',
		headers: {
			'Fastly-Key': process.env.FASTLY_PURGEKEY,
		},
	});

	// GET once from fastly (but don't wait) to ensure the fastly shield has
	// fresh content
	fetch(purgeUrl(uuid));

	await handleResponse(response);
};

const purgeAmp = async uuid => {
	const {hostname, pathname} = url.parse(purgeUrl(uuid));
	const response = fetch(`https://cdn.ampproject.org/update-ping/i/s/${hostname}${pathname}`);

	await handleResponse(response);
};

if(missing) {
	console.log(`⤼  ${missing}, not listening for content updates`);
} else {
	const stream = kinesisDecoded({name: 'next-elasticsearch-changelog', region: 'eu-west-1'});

	stream.on('data', data => {
		switch(data.event) {
			case 'CREATE':
			case 'UPDATE':
			case 'DELETE': {
				console.log(`⟳  received ${data.event} for ${data.uuid}`);

				logPurge({
					uuid: data.uuid,
					name: 'Fastly',
				})(purgeFastly(data.uuid));

				logPurge({
					uuid: data.uuid,
					name: 'AMP',
				})(purgeAmp(data.uuid));

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
