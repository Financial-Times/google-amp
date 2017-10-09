'use strict';

const kinesis = require('kinesis');
const {Transform} = require('stream');

class KinesisToBuffer extends Transform {
	constructor(options) {
		super(Object.assign({objectMode: true}, options));
	}

	_transform(record, encoding, cb) {
		cb(null, record.Data);
	}
}

const toBuffer = new KinesisToBuffer();
const stream = kinesis.stream({name: 'next-elasticsearch-changelog', region: 'eu-west-1'}).pipe(toBuffer);

stream.on('data', data => {
	console.log(data);
});

stream.on('error', e => {
	console.error(e.stack);
	process.exit(1);
});
