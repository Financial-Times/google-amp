'use strict';
const getItem = require('../lib/getItem');
const Handlebars = require('handlebars');
const articleTemplateSource= require('fs').readFileSync('./views/article.html', {'encoding': 'utf8'});
const renderArticleTemplate = Handlebars.compile(articleTemplateSource);
const transformArticle = require('../lib/transformEsV3Item.js');

module.exports = (req, res) => {
    getItem(req.params.uuid)
        .then(apiResponse => {
            return transformArticle(apiResponse._source);  
        })
        .then(contentItem => {
            res.send(renderArticleTemplate(contentItem));
        })
        .catch(err => {
            console.log(err);
            res.status(503).send('Noooooooo!');
        }) 
}
 