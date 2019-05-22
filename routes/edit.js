var express = require('express');
var router = express.Router();
var db = require('../db/db');
var Content = require('../db/model/content');
var mongoose = require('mongoose');

router.get('/:title*', function(req, res, next) {
	Content.findOne({title: req.params.title + req.params[0]}, function(err, content) {
		if(err){return next(err);}
		if(content) {
			content.content = content.content.replace(/\\"/g, "\"");
			return res.render('edit', {title: content.title, content: content.content, _id: content._id});
		} else {
			return res.render('edit', {title: req.params.title + req.params[0], content: "", _id: 0});
		}
	});
});

router.post('/:title*', function(req, res, next) {
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
	text = text.replace(/"/g, "\\\"");
	
	if(req.body._id === '0') {
		var newContent = new Content({
			title: req.params.title + req.params[0],
			content: text,
			modified: [["annonymous", tod]],
			finalModifiedDate: tod,
			finalModifier: "annonymous"
		});
		newContent.save(function(err) {return next(err);});
		res.redirect('/w/'+req.params.title + req.params[0]);
	} else {
		Content.findOne({title: req.body.title}, function(err, content) {
			content.modified.unshift(["annonymous", tod]);
			content.content = text;
			content.finalModifier = "annonymous";
			content.finalModifiedDate = tod;
			content.save(function(err) {return next(err);});
			//Content.updateOne({title: req.body.title}, {content: req.body.text, modified: content.modified, finalModifier: "annonymous", finalModifiedDate: tod});
			return res.redirect('/w/' + content.title);
		});
	}
});

module.exports = router;
