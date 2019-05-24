var express = require('express');
var router = express.Router();
var db = require('../db/db');
var Content = require('../db/model/content');
var mongoose = require('mongoose');

router.get('/:title*', function(req, res, next) {
	Content.findOne({title: req.params.title + req.params[0]}, function(err, content) {
		if(err){return next(err);}
		if(content) {
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
	    	txt = txt.replace(/\\"/g, "\"");
			return res.render('edit', {title: content.title, content: txt, _id: content._id});
		} else {
			return res.render('edit', {title: req.params.title + req.params[0], content: "", _id: 0});
		}
	});
});

router.post('/:title*', function(req, res, next) {
	if(req.session.user) {
		var today = new Date();
		var yyyy = today.getFullYear();
		var mm = today.getMonth()+1; //January is 0!
		var dd = today.getDate();
		var h = today.getHours();
		var m = today.getMinutes();
		var s = today.getSeconds();
		
		if(dd<10) {dd='0'+dd;} 
		if(mm<10) {mm='0'+mm;} 
		if(h<10) {h='0'+h;}
		if(m<10) {m='0'+m;}
		if(s<10) {s='0'+s;}
	
		var tod = yyyy + '/' + mm + '/' + dd+' '+ h + ':' + m + ':' + s;
		
		var text = req.body.text;
		var idx = new Array();
		
		text = text.replace(/"/g, "\\\"");
		// protect XSS
		text = text.replace(/<script/g, "&lt;script");
		var idx = text.match(/(={1,6}) [^=]*? \1\r\n/g);
		
    	text = text.split(/(={1,6}) [^=]*? \1\r\n/);
    	// なんか分からない要素があってスライスする
    	// 喫水インデックスに問題あり
    	for (var i = 0; i < text.length; i++) { 
    		text.splice(i + 1, 1); 
    	} 
		
		if(req.body._id === '0') {
			var newContent = new Content({
				title: req.params.title + req.params[0],
				idx: idx,
				content: text,
				modified: [[req.session.user.username, tod]],
				finalModifiedDate: tod,
				finalModifier: req.session.user.username
			});
			newContent.save(function(err) {return next(err);});
			res.redirect('/w/'+req.params.title + req.params[0]);
		} else {
			Content.findOne({title: req.body.title}, function(err, content) {
				content.modified.unshift([req.session.user.username, tod]);
				content.idx = idx;
				content.content = text;
				content.finalModifier = req.session.user.username;
				content.finalModifiedDate = tod;
				content.save(function(err) {return next(err);});
				//Content.updateOne({title: req.body.title}, {content: req.body.text, modified: content.modified, finalModifier: "annonymous", finalModifiedDate: tod});
				return res.redirect('/w/' + content.title);
			});
		}
	} else {
		res.redirect('/w/' + req.params.title + req.params[0]);
	}
});

module.exports = router;
