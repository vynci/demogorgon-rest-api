var mongoose = require('mongoose')
, Schema = mongoose.Schema
,ObjectId = Schema.ObjectId;

var widgetSchema = new Schema({
	name:  String,
	description:  String,
	widgetInfo: Schema.Types.Mixed,
    dashboardId : String,
	thingType: String,
	components: Schema.Types.Mixed,
	owner: String,
	payload: String,
	thingId: String,
	buttonLabel: String,
	createDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Widget', widgetSchema);
