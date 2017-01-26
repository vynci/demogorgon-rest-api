var mongoose = require('mongoose')
, Schema = mongoose.Schema
,ObjectId = Schema.ObjectId;

var logSchema = new Schema({
	value:  String,
    thingId : String,
	createDate: {type: Date, default: Date.now},
	owner: String
});

module.exports = mongoose.model('Log', logSchema);
