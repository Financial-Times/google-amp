'use strict';

const os = require('os');
const v8 = require('v8');
const throng = require('throng');

if(process.env.WEB_MEMORY) {
	const gcMemory = Math.floor(parseInt(process.env.WEB_MEMORY, 10) * 4 / 5);
	v8.setFlagsFromString(`--max_old_space_size=${gcMemory}`);
}

const port = process.env.PORT || 5000;

const workers = process.env.WEB_CONCURRENCY ?
	parseInt(process.env.WEB_CONCURRENCY, 10) :
	os.cpus().length;

throng({
	workers,
	master() {
		console.log(`Starting ${workers} workers`);
	},

	start() {
		const app = require('./server');

		app.listen(port, () => console.log(`Worker ${process.pid} listening on port ${port}`));
		},
});
