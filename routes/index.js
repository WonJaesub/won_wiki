var express = require('express');
var router = express.Router();
var db = require('../db/db');
var Content = require('../db/model/content');
var mongoose = require('mongoose');

router.get('/random', function(req, res, next) {
	/*db.collection.aggregate([  
        { $sample: {size: 20} }, 
        { $match:  {"yourField": valueOrSpecifier} } 
      ])*/
	//db.contents.aggregate([ { $sample: {size: 1} } ]);
	Content.aggregate([{$sample: {size: 1}}], function(err, content) {
		if(err){return next(err);}
		if(content[0]){
	    	return res.redirect('/w/' + content[0].title);
	    } else {
	    	return res.redirect('/');
	    }
	});
});

router.get('/recent', function(req, res, next) {
	Content.find({},
	['title','finalModifier', 'finalModifiedDate'], // Columns to Return
	{
	    skip:0, // Starting Row
	    limit:100, // Ending Row
	    sort:{
	        finalModifiedDate: -1 //Sort by Date Added DESC
	    }
	},
	function(err,contents){
		if(err){return next(err);}
	    return res.render('recent', {contents: contents});
	});
});

router.get('/search', function(req, res, next) {
	var search = req.query.searchInput;
	Content.findOne({title: search}, function(err, content) {
		if(err){return next(err);}
		if(content) {
			return res.redirect('/w/' + search);
		} else {
			return res.render('search', {title: search});
		}
	});
});

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
	res.redirect('/w/MainGate');
});

module.exports = router;
