var mongoose = require('mongoose')
, Schema = mongoose.Schema
,ObjectId = Schema.ObjectId;

var thingSchema = new Schema({
	name:  String,
	value:  String,
	status:  {type: Boolean, default: false},
	createDate: {type: Date, default: Date.now},
	owner: String
});

module.exports = mongoose.model('Thing', thingSchema);
