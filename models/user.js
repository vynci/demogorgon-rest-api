var mongoose = require('mongoose')
, Schema = mongoose.Schema
,ObjectId = Schema.ObjectId;

var userSchema = new Schema({
	name:  String,
	email:  { type: String, index: { unique: true }},
  password: String,
	status:  {type: Boolean, default: true},
	createDate: {type: Date, default: Date.now},
});

module.exports = mongoose.model('User', userSchema);
