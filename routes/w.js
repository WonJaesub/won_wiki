var express = require('express');
var router = express.Router();
var Content = require('../db/model/content');

/* GET home page. */
//router.get('/:userid', function(req, res, next) {
router.get( '/:title*' , function(req, res, next) {
	Content.findOne({title : req.params.title + req.params[0]}, function(err, content) {
		if(err){return next(err);}
	    if(content){
	    	var txt = content.content;
	    	txt = txt.replace(/\\"/g, "\"");
	    	txt = txt.replace(/\[\[([^\[\]]*)\]\]/g, "<a href='/w/$1'>$1</a>");
	    	txt = txt.replace(/\r\n/g, "<br>");
	    	//txt = txt.replace(/\\/g, '');
	    	txt = txt.replace(/\\([\[\]\|\=\-\'\"])/g, '$1');
	    	
	    	return res.render('index', {title: content.title, content: txt, finalModifiedDate: content.finalModifiedDate});
	    } else {
	    	return res.render('notExist', {title: req.params.title + req.params[0]});
	    }
	}); // end of Content.findOne
});

module.exports = router;
