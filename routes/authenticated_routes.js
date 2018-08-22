var express = require('express');
var router = express.Router();

var _configManagement = require('../server_controllers/configurationManagement');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/test', function(req, res, next) {
  res.render('trial2');
});
router.get('/editConfiguration', function(req,res,next){
  res.render('editConfiguration');
});

router.get('/getConfigData', function(req,res){
  _configManagement.getConfiguration(req,res)
  .done(function(resolve){
    res.send(resolve);
  }).fail(function(err){
    res.send(err);
  });
});

module.exports = router;