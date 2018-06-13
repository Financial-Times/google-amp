'use strict';

const kinesisDecoded = require('@quarterto/kinesis-decoded');
const fetch = require('node-fetch');
const assertEnv = require('@quarterto/assert-env');
const logPromise = require('@quarterto/log-promise');
const url = require('url');
const util = require('util');

const logPurge = ({name, purgeUrl}) => logPromise(
	` purged ${purgeUrl} from ${name}`,
	err => ` ${err.message} from ${name}${(err.data ? `\n\n${util.inspect(err.data)}` : '')}`
);

const handleResponse = async (response, purgeUrl) => {
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

const purgeFastly = purgeUrl => logPurge({
	purgeUrl,
	name: 'Fastly',
})((async () => {
	const response = await fetch(purgeUrl, {
		method: 'PURGE',
		headers: {
			'Fastly-Key': process.env.FASTLY_PURGEKEY,
		},
	});

	// GET once from fastly (but don't wait) to ensure the fastly shield has
	// fresh content
	fetch(purgeUrl);

	return handleResponse(response, purgeUrl);
})());

const purgeAmp = purgeUrl => logPurge({
	purgeUrl,
	name: 'AMP',
})((async () => {
	const {hostname, pathname} = url.parse(purgeUrl);
	const response = fetch(`https://cdn.ampproject.org/update-ping/i/s/${hostname}${pathname}`);

	return handleResponse(response, purgeUrl);
})());

const formatPurgeUrl = (uuid, host) => url.format({
	protocol: 'https',
	host,
	pathname: `/content/${uuid}`,
});

const purge = async uuid => {
	const fastlyHosts = process.env.NODE_ENV === 'staging'
		? ['amp-staging.ft.com']
		: [
			'amp.ft.com',
			'amp-eu.ft.com',
			'amp-us.ft.com',
		];

	const ampHost = fastlyHosts[0];

	await Promise.all(fastlyHosts.map(
		host => purgeFastly(formatPurgeUrl(uuid, host))
	));

	await purgeAmp(formatPurgeUrl(uuid, ampHost));
};

exports.purgeFastly = purgeFastly;
exports.purgeAmp = purgeAmp;
exports.purge = purge;

exports.worker = () => {
	const missingEnv = assertEnv.warn(['FASTLY_PURGEKEY']);

	if(missingEnv) {
		console.log(`⤼  ${missingEnv}, not listening for content updates`);
	} else {
		const stream = kinesisDecoded({name: 'next-elasticsearch-changelog', region: 'eu-west-1'});

		stream.on('data', data => {
			switch(data.event) {
				case 'CREATE':
				case 'UPDATE':
				case 'DELETE': {
					console.log(`⟳  received ${data.event} for ${data.uuid}`);

					purge(data.uuid);

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
};
