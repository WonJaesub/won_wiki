var express = require('express');
var router = express.Router();
var Content = require('../db/model/content');

/* GET history page. */
//router.get('/:userid', function(req, res, next) {
router.get( '/:title*' , function(req, res, next) {
	Content.findOne({title : req.params.title + req.params[0]}, function(err, content) {
		if(err){return next(err);}
	    if(content){
			
	    	return res.render('history', {title: content.title, modarray: content.modified});
	    } else {
	    	return res.render('history_404', {title: req.params.title + req.params[0]});
	    }
	}); // end of Content.findOne
});

module.exports = router;
