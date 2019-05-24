var express = require('express');
var router = express.Router();
var Content = require('../db/model/content');

/* GET home page. */
//router.get('/:userid', function(req, res, next) {
router.get( '/:title*' , function(req, res, next) {
	Content.findOne({title : req.params.title + req.params[0]}, function(err, content) {
		if(err){return next(err);}
	    if(content){
	    	var txt = "";
	    	if(content.idx !== null) {
		    	if(content.idx.length !== content.content.length) {
		    		txt += content.content[0];
		    		for(var i=0; i<content.idx.length; i++) {
		    			txt+= content.idx[i];
		    			txt+= content.content[i+1];
		    		}
		    	} else {
		    		for(var i=0; i<content.idx.length; i++) {
		    			txt += content.idx[i];
		    			txt += content.content[i];
		    		}
		    	}
	    	} else { // idx is null
	    		txt = content.content.join('');
	    	}
	    	txt = require('../public/editFunctions')(txt);
	    	
	    	var text = txt;
	    	var idx = text.match(/(={1,6}) [^=]*? \1\r\n/g);
			
	    	text = text.split(/(={1,6}) [^=]*? \1\r\n/);
	    	// なんか分からない要素があってスライスする
	    	// 喫水インデックスに問題あり
	    	for (var i = 0; i < text.length; i++) { 
	    		text.splice(i + 1, 1); 
	    	} 
	    	//console.log(idx);
	    	text = text.join('');
	    	text = text.replace(/(\|\|[\s\S]*?\|\|\r\n\r\n)/g, '');
	    	//console.log(text);
	    	
	    	
			
	    	return res.render('index', {title: content.title, content: txt, finalModifiedDate: content.finalModifiedDate});
	    } else {
	    	return res.render('notExist', {title: req.params.title + req.params[0]});
	    }
	}); // end of Content.findOne
});

module.exports = router;
