var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("home")
  async.parallel({
    bittrexData: function(callback) {
      request({
        url: 'http://shapeless-shifting.herokuapp.com/api/getCurrentBittrexData',
        method: 'GET'
      }, function (err, response, body) {
        if(err) {
          var error = new Error();
          error.status = err.status;
          error.statusCode = err.statusCode;
          callback(error, {info: err});
        } else {
          var data = JSON.parse(body);
          callback(null, data)
        }
      })
    },
    btceData: function(callback) {
      request({
        url: 'http://shapeless-shifting.herokuapp.com/api/getCurrentBTCEData',
        method: 'GET'
      }, function (err, response, body) {
        if(err) {
          var error = new Error();
          error.status = err.status;
          error.statusCode = err.statusCode;
          callback(error, {info: err});
        } else {
          var data = JSON.parse(body);
          callback(null, data);
        }
      })
    }
  }, function(err, results) {
    if(err) {
      throw err;
    } else {
      res.render('index', { title: 'BitCoin Exchange', bitTrex: results.bittrexData, btce: results.btceData });
    }
  });
});

module.exports = router;
