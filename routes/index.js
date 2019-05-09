var express = require('express');
var router = express.Router();

router.get('/random', function(req, res, next) {
	res.render('random');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
