const { response } = require('express');
const request = require('request');
const updateControl = require('../databaseQueries/updateAllData');
const getData = require('../databaseQueries/getData');

class SiteController {
    index(req, res, next) {
        res.send('abcd');
    }
}

module.exports = new SiteController();
