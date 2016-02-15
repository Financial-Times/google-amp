const handlebars = require('handlebars');
const compileScss = require('./compile-scss');
const fs = require('fs-promise');
const path = require('path');
const cacheIf = require('@quarterto/cache-if');

const cssPath = path.resolve('css');
const viewsPath = path.resolve('views');

const readCompiledCss = () => fs.readFile(`${cssPath}/style.css`, 'utf8');

const getCss = precompiled => precompiled ?
				cacheIf.always(readCompiledCss)
				: compileScss();

const readTemplate = () => fs.readFile(`${viewsPath}/article.html`, 'utf8').then(handlebars.compile);
const getTemplate = precompiled => cacheIf(() => precompiled, readTemplate);

module.exports = (data, options) => Promise.all([
	getTemplate(options.precompiled),
	getCss(options.precompiled),
]).then(t => t[0](Object.assign({
	css: t[1]
}, data)));
