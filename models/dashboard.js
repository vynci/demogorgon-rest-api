var mongoose = require('mongoose')
, Schema = mongoose.Schema
,ObjectId = Schema.ObjectId;

var dashboardSchema = new Schema({
	name:  String,
	description:  String,
	owner: String,
    widgets : Array,
	createDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Dashboard', dashboardSchema);