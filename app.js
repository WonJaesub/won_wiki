var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressSession = require('express-session');

var app = express();

var indexRouter = require('./routes/index');
var wRouter = require('./routes/w');
var editRouter = require('./routes/edit');
var memberRouter = require('./routes/member');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressSession({
	 secret: '@#@$MYWIKISIGN#@$#$',
	 resave: false,
	 saveUninitialized: true
	}));

app.use(function(req, res, next) {
	if(!req.session.user && !req.session.ip) {
		req.session.ip = req.headers['x-forwarded-for'] || 
        req.connection.remoteAddress || 
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);
		
		if (req.session.ip.substr(0, 7) === "::ffff:") {
			req.session.ip = req.session.ip.substr(7);
		}
	}
	res.locals.ip = req.session.ip;
	res.locals.user = req.session.user;
	res.locals.url = encodeURIComponent(req.originalUrl);
	next();
});

app.use('/w/', wRouter);
app.use('/edit/', editRouter);
app.use('/member/', memberRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
