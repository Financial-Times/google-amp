const handlebars = require('handlebars');
const compileScss = require('./compile-scss');
const fs = require('fs-promise');
const path = require('path');

const cssPath = path.resolve('css');
const viewsPath = path.resolve('views');

const scssPromise = process.env.NODE_ENV === 'production' ?
				fs.readFile(`${cssPath}/style.css`, 'utf8')
				: compileScss();

const templatePromise = fs.readFile(`${viewsPath}/article.html`, 'utf8').then(handlebars.compile);

module.exports = data => Promise.all([
	templatePromise,
	scssPromise,
]).then(t => t[0](Object.assign({
	css: t[1]
}, data)));
