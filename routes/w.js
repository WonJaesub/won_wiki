var express = require('express');
var router = express.Router();
var Content = require('../db/model/content');

/* GET home page. */
//router.get('/:userid', function(req, res, next) {
router.get( '/:title*' , function(req, res, next) {
	//res.render('index', { title: req.params.title + req.params[0] });
	Content.findOne({title : req.params.title + req.params[0]}, function(err, content) {
		if(err){return next(err);}
	    if(content){
	    	content.content = content.content.replace(/\r\n/g, "<br>");
	    	
	    	return res.render('index', {title: content.title, content: content.content, finalModifiedDate: content.finalModifiedDate});
	    } else {
	    	return res.render('notExist', {title: req.params.title + req.params[0]});
	    }
	}); // end of Content.findOne
});

module.exports = router;
