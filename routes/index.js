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
        url: 'http://localhost:3000/api/getCurrentBittrexData',
        method: 'GET'
      }, function (err, response, body) {
        if(err) {
          var error = new Error();
          error.status = err.status;
          error.statusCode = err.statusCode;
        } else {
          var data = JSON.parse(body);
          console.log(data);
          callback(null, data)
        }
      })
    },
    btceData: function(callback) {
      request({
        url: 'http://localhost:3000/api/getCurrentBTCEData',
        method: 'GET'
      }, function (err, response, body) {
        if(err) {
          var error = new Error();
          error.status = err.status;
          error.statusCode = err.statusCode;
          console.log(err);
        } else {
          var data = JSON.parse(body);
          callback(null, data);
        }
      })
    }
  }, function(err, results) {
    if(err) {
      console.log(err);
    } else {
      console.log(results)
      res.render('index', { title: 'Exchange', bitTrex: results.bittrexData, btce: results.btceData });
    }
  });
});
//
// router.get('https://bittrex.com/api/v1.1/public/getmarkets', function(req, res, next) {
//   request('https://bittrex.com/api/v1.1/public/getmarkets', function(err, body) {
//
//   })
// });

module.exports = router;
