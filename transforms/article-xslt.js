'use strict';

var spawn = require('child_process').spawn;

module.exports = function(xml, stylesheet, params) {
	return new Promise(function(resolve, reject) {
		var output = [];
		var errors = [];
		var options = [
			'--html',
			'--novalid',
			'--encoding', 'utf-8'
		];

		params && Object.keys(params).forEach(function(param) {
			var string = typeof params[param] === 'string';
			options = options.concat(string ? '--stringparam' : '--param', param, params[param]);
		});

		var env = { PATH: "/app/libxslt/bin:" + process.env.PATH };
		var xsltproc = spawn('xsltproc', options.concat(
			process.cwd() + '/server/stylesheets/' + stylesheet + '.xsl',
			'-'
		), { env: env });

		xsltproc.stdin.write(xml);

		xsltproc.stdin.end();

		xsltproc.stdout.on('data', function(data) {
			output.push(data);
		});

		xsltproc.stderr.on('data', function(error) {
			errors.push(error.toString());
		});

		xsltproc.on('error', function(error) {
			reject(error.toString());
		});

		xsltproc.on('close', function(code) {
			if (code !== 0) {
				return reject('xsltproc exited with code ' + code + ': ' + errors);
			}

			resolve(output.join('').replace(/<\/?html>/g, ''));
		});
	});
};
