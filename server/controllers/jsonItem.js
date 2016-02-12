'use strict';
const getItem = require('../lib/getItem');

module.exports = (req, res) => {
    getItem(req.params.uuid)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log(err);
            res.status(503).send('Noooooooo!');
        });
}
 