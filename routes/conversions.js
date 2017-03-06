var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');

router.post('/', function (req, res, next) {
  var toCurrency = req.body.toCurrency;
  var amount = req.body.amountToConvert;
  router.convertCurrency(toCurrency, amount, function(err, results) {
    res.send(results);
  })
});

router.convertCurrency = function (currencyType, amount, next) {
  async.parallel({
    bittrex: function(callback) {
      request({
            url: 'http://shapeless-shifting.herokuapp.com/api/getCurrentBittrexData',
            method: 'GET',
            qs: {currencyType: currencyType},
          }, function (err, response, body) {
        if (err) {
          var error = new Error();
          error.status = err.status;
          error.statusCode = err.statusCode;
          callback(error, {userInfo: err})
        } else {
          var parsedBody = JSON.parse(body);
          var data = parsedBody[currencyType];
          var conversionAmount = amount / data;
          var roundedConversionAmount = parseFloat(conversionAmount.toFixed(5));
          callback(null, roundedConversionAmount);
        }
      })
    },
    btceData: function(callback) {
      request({
        url: 'http://shapeless-shifting.herokuapp.com/api/getCurrentBTCEData',
        method: 'GET',
        qs: {currencyType: currencyType},
      }, function (err, response, body) {
        if(err) {
          var error = new Error();
          error.status = err.status;
          error.statusCode = err.statusCode;
          callback(error, {userInfo: err})
        } else {
          var parsedBody = JSON.parse(body);
          var data = parsedBody[currencyType];
          var lastKnownTrade = data.last;
          var conversionAmount = amount / lastKnownTrade;
          var roundedConversionAmount = parseFloat(conversionAmount.toFixed(5));
          callback(null, roundedConversionAmount);
        }
      })
    }
  }, function(err, results) {
    if(err) {
      throw err;
    }
    var finalResults = {};
    var bestResult;
    var otherResult;
    var exchangeMargin;
    if(results.bittrex > results.btceData) {
      exchangeMargin = results.bittrex - results.btceData;
      bestResult = { "exchangePlatform": "Bittrex", "exchangeRate" : results.bittrex, "toCurrency": currencyType };
      otherResult = { "exchangePlatform": "BTC-e", "exchangeRate" : results.btceData, "toCurrency": currencyType };
    } else {
      exchangeMargin = results.btceData - results.bittrex;
      bestResult = { "exchangePlatform": "BTC-e", "exchangeRate" : results.btceData, "toCurrency": currencyType };
      otherResult = { "exchangePlatform": "Bittrex", "exchangeRate" : results.bittrex, "toCurrency": currencyType };
    }
    finalResults.bestResult = bestResult;
    finalResults.otherResult = otherResult;
    finalResults.exchangeMargin = parseFloat(exchangeMargin.toFixed(5))
    next(null, finalResults);
  })
};

module.exports = router;
