var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/wiki', { useNewUrlParser: true });

var db = mongoose.connection;

// error binding
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;