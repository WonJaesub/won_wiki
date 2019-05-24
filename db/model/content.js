var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contentSchema = new Schema({
	title: String,
	idx: Array,
	content: Array,
	modified: Array,
	finalModifiedDate: String,
	finalModifier: String
});

module.exports = mongoose.model('content', contentSchema);