var mongoose = require('mongoose')
, Schema = mongoose.Schema
,ObjectId = Schema.ObjectId;
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new Schema({
	name:  String,
	email: { type: String, index: true, unique: true, required: true },
	password: { type: String, required: true },
	status:  {type: Boolean, default: true},
	createDate: {type: Date, default: Date.now}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
