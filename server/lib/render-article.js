const handlebars = require('handlebars');
const compileScss = require('./compile-scss');
const fs = require('fs-promise');
const path = require('path');
const denodeify = require('denodeify');
const glob = denodeify(require('glob'));
const cacheIf = require('@quarterto/cache-if');
const promiseAllObj = require('@quarterto/promise-all-object');

const cssPath = path.resolve('css');
const viewsPath = path.resolve('views');
const partialsPath = path.resolve('views/partials');
const staticPath = path.resolve('static');

const readCompiledCss = () => fs.readFile(`${cssPath}/style.css`, 'utf8');

const getCss = precompiled => precompiled ?
				cacheIf.always(readCompiledCss)
				: compileScss();

const readTemplate = () => fs.readFile(`${viewsPath}/article.html`, 'utf8').then(handlebars.compile);
const getTemplate = precompiled => cacheIf(() => precompiled, readTemplate);

// TODO: use n-handlebars and get this for free?
const applyPartials = () => glob(`${partialsPath}/**/*.html`)
    .then(files => {
        const promises = files.map(file => {
            const name = file.replace(/^.*\/(.*)\.html$/, '$1');
            return fs.readFile(file, 'utf8')
                .then(html => handlebars.registerPartial(name, html));
        });
        return Promise.all(promises);
    });
const getPartials = precompiled => cacheIf(() => precompiled, applyPartials);

const getAuthors = data => {
    let authors =  data.metadata
    .filter(item => {return (item.taxonomy && item.taxonomy === 'authors') ? true : false})
    .map(item => {return item.prefLabel})
    .join(', ');

    // Somtimes there are no authors in the taxonomy. It's very sad but it's true.
    return authors === '' ? data.byline : authors;
}

const getMainImage = data => {
    if (data.mainImage) {
        return {
            url: data.mainImage.url,
            width: data.mainImage.width,
            height: data.mainImage.height
        };
    } else {
        // Return a default logo image if an actual image is not available
        // TODO pull out the lead image from the body XML if possible
        return {
            "url": "http://im.ft-static.com/m/img/masthead_main.jpg",
            "width": 435,
            "height": 36
        }
    }
}

module.exports = (data, options) => promiseAllObj({
    template: getTemplate(options.precompiled),
	partials: getPartials(options.precompiled),
	css: getCss(options.precompiled),
	ftSvg: fs.readFile(`${staticPath}/ft-logo.svg`, 'utf8'),
	nikkeiSvg: fs.readFile(`${staticPath}/nikkei-logo.svg`, 'utf8'),
    description: data.summaries ? data.summaries[0] : '',
    authorList: getAuthors(data),
    mainImage: getMainImage(data)
}).then(t => t.template(Object.assign(t, data)));
