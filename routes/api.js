var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
var autoBahn = require('autobahn');
var supportedCurrencies = ['LTC', 'DASH', 'ETH'];

router.get('/getCurrentBittrexData', function(req, res) {
    var base_url = 'https://bittrex.com/api/v1.1/public';
    var queryParams = supportedCurrencies;
    if (Object.keys(req.query).length > 0) {
        queryParams = [req.query.currencyType];
    }
    async.parallel(
        {
            LTC: function(callback) {
                if (queryParams.indexOf('LTC') >= 0) {
                    request({
                        url: base_url + '/getticker?market=btc-ltc',
                        method: 'GET'
                    }, function (err, response, body) {
                        if(err) {
                            var error = new Error();
                            error.status = err.status;
                            error.statusCode = err.statusCode;
                            callback(error, {info: err});
                        } else {
                            var data = JSON.parse(body);
                            callback(null, data.result);
                        }
                    })
                } else {
                    callback();
                }
            },
            DASH: function(callback) {
                if (queryParams.indexOf('DASH') >= 0) {
                    request({
                        url: base_url + '/getticker?market=btc-dash',
                        method: 'GET'
                    }, function (err, response, body) {
                        if (err) {
                            var error = new Error();
                            error.status = err.status;
                            error.statusCode = err.statusCode;
                            callback(error, {info: err});
                        } else {
                            var data = JSON.parse(body);
                            callback(null, data.result);
                        }
                    })
                } else {
                    callback();
                }
            },
            ETH: function(callback) {
                if (queryParams.indexOf('ETH') >= 0) {
                    request({
                        url: base_url + '/getticker?market=btc-eth',
                        method: 'GET'
                    }, function (err, response, body) {
                        if (err) {
                            var error = new Error();
                            error.status = err.status;
                            error.statusCode = err.statusCode;
                            callback(error, {info: err});
                        } else {
                            var data = JSON.parse(body);
                            callback(null, data.result);
                        }
                    })
                } else {
                    callback();
                }
            }
        }, function(err, results) {
            if(err){
                throw err;
            }
            var finalResults = {};
            var keys = Object.keys(results);
            for (var i = 0; i < keys.length; i++) {
                if(results[keys[i]] !== undefined && results[keys[i]] !== null) {
                    finalResults[keys[i]] = parseFloat(results[keys[i]].Last.toFixed(5));
                }
            }
            res.json(finalResults);
        }
    )
});

router.get('/getCurrentBTCEData', function(req, res) {
    var base_url = 'https://btc-e.com/api/3/ticker';
    var queryParams = supportedCurrencies;
    if (Object.keys(req.query).length > 0) {
        queryParams = [req.query.currencyType];
    }
    async.parallel(
        {
            LTC: function(callback) {
                if (queryParams.indexOf('LTC') >= 0) {
                    var exchangeName = 'ltc_btc';
                    request({
                        url: base_url + '/' + exchangeName,
                        method: 'GET'
                    }, function (err, response, body) {
                        if (err) {
                            var error = new Error();
                            error.status = err.status;
                            error.statusCode = err.statusCode;
                            callback(error, {info: err});
                        } else {
                            var data = JSON.parse(body);
                            callback(null, data[exchangeName]);
                        }
                    })
                } else {
                    callback();
                }
            },
            DASH: function(callback) {
                if (queryParams.indexOf('DASH') >= 0) {
                    var exchangeName = 'dsh_btc';
                    request({
                        url: base_url + '/' + exchangeName,
                        method: 'GET'
                    }, function (err, response, body) {
                        if (err) {
                            var error = new Error();
                            error.status = err.status;
                            error.statusCode = err.statusCode;
                            callback(error, {info: err});
                        } else {
                            var data = JSON.parse(body);
                            callback(null, data[exchangeName]);
                        }
                    })
                } else {
                    callback();
                }
            },
            ETH: function(callback) {
                if (queryParams.indexOf('ETH') >= 0) {
                    var exchangeName = 'eth_btc';
                    request({
                        url: base_url + '/' + exchangeName,
                        method: 'GET'
                    }, function (err, response, body) {
                        if (err) {
                            var error = new Error();
                            error.status = err.status;
                            error.statusCode = err.statusCode;
                            callback(error, {info: err});
                        } else {
                            var data = JSON.parse(body);
                            callback(null, data[exchangeName]);
                        }
                    })
                } else {
                    callback();
                }
            }
        }, function(err, results) {
            if(err){
                throw err;
            }
            var finalResults = {};
            var keys = Object.keys(results);
            for (var i = 0; i < keys.length; i++) {
                if(results[keys[i]] !== undefined && results[keys[i]] !== null) {
                    finalResults[keys[i]] = results[keys[i]];
                }
            }
            res.json(finalResults);
        }
    )
});

module.exports = router;
