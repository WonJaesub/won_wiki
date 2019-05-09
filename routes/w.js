var express = require('express');
var router = express.Router();

/* GET home page. */
//router.get('/:userid', function(req, res, next) {
router.get( '/:userid*' , function(req, res, next) {
  res.render('index', { title: req.params.userid + req.params[0] });
});

module.exports = router;
