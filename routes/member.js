var express = require('express');
var router = express.Router();
var db = require('../db/db');
var User = require('../db/model/user');
var mongoose = require('mongoose');
var crypto = require('crypto');

router.get('/login', function(req, res, next) {
	res.render('login', {signupUrl: encodeURIComponent(req.query.redirect), loginfail: false});
});

router.post('/login', function(req, res, next) {
	var shasum = crypto.createHash('sha512');
	shasum.update(req.body.password);
	var inputPassword = shasum.digest('hex');
	
	User.findOne({username: req.body.username, password: inputPassword}, function(err, user) {
		if(err){return next(err);}
		if(user) {
			// login
			req.session.user = user;
			res.redirect(decodeURIComponent(req.query.redirect));
		} else {
			// id not found
			res.render('login', {signupUrl: encodeURIComponent(req.query.redirect), loginfail: true});
		}
	});
});

router.get('/logout', function(req, res, next) {
	var ip = req.session.ip;
	req.session.destroy();
	req.session.ip = ip;
	res.redirect(decodeURIComponent(req.query.redirect));
});

router.get('/signup', function(req, res, next) {
	res.render('signup', {signupfail: false});
});

router.post('/signup', function(req, res, next) {
	var shasum = crypto.createHash('sha512');
	shasum.update(req.body.password);
	var inputPassword = shasum.digest('hex');
	
	User.findOne({username: req.body.username}, function(err, user) {
		if(err){return next(err);}
		if(user) {
			// id exist already
			res.render('signup', {signupfail: true});
		} else {
			// id not found
			var newUser = new User({
				username: req.body.username,
				password: inputPassword
			});
				
			newUser.save(function(err) {return next(err);});
			res.redirect(req.query.redirect);
		}
	});
});

module.exports = router;
