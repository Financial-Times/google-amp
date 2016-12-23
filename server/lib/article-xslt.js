'use strict';

const spawn = require('child_process').spawn;

module.exports = function articleXslt(xml, stylesheet = 'main', params = {}) {
	return new Promise((resolve, reject) => {
		const output = [];
		const errors = [];
		let options = [
			'--html',
			'--novalid',
			'--encoding', 'utf-8',
		];

		if(params) {
			Object.keys(params).forEach(param => {
				const string = typeof params[param] === 'string';
				options = options.concat(string ? '--stringparam' : '--param', param, params[param]);
			});
		}

		const env = {PATH: `/app/libxslt/bin:${process.env.PATH}`};
		const xsltproc = spawn('xsltproc', options.concat(
			`${process.cwd()}/server/stylesheets/${stylesheet}.xsl`,
			'-'
		), {env});

		xsltproc.stdin.write(xml);

		xsltproc.stdin.end();

		xsltproc.stdout.on('data', data => {
			output.push(data);
		});

		xsltproc.stderr.on('data', error => {
			errors.push(error.toString());
		});

		xsltproc.on('error', error => {
			reject(error.toString());
		});

		xsltproc.on('close', code => {
			if(code !== 0) {
				return reject(`xsltproc exited with code ${code}: ${errors}`);
			}

			resolve(output.join('').replace(/<\/?html>/g, ''));
		});
	});
};
