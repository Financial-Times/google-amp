const handlebars = require('handlebars');
const compileScss = require('./compile-scss');
const fs = require('fs-promise');
const path = require('path');
const cacheIf = require('@quarterto/cache-if');
const promiseAllObj = require('@quarterto/promise-all-object');

const cssPath = path.resolve('css');
const viewsPath = path.resolve('views');
const staticPath = path.resolve('static');

const readCompiledCss = () => fs.readFile(`${cssPath}/style.css`, 'utf8');

const getCss = precompiled => precompiled ?
				cacheIf.always(readCompiledCss)
				: compileScss();

const readTemplate = () => fs.readFile(`${viewsPath}/article.html`, 'utf8').then(handlebars.compile);
const getTemplate = precompiled => cacheIf(() => precompiled, readTemplate);

module.exports = (data, options) => promiseAllObj({
	template: getTemplate(options.precompiled),
	css: getCss(options.precompiled),
	logoSvg: fs.readFile(`${staticPath}/logo.svg`, 'utf8'),
}).then(t => t.template(Object.assign(t, data)));
