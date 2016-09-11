var express = require('express')
, mongoose = require('mongoose')
, app = module.exports = express()
, bodyParser = require('body-parser')
, methodOverride = require('method-override')

, env = process.env.NODE_ENV || 'development'
, config = require('./config')[env]

var port = Number(process.env.PORT || 3000);

// connect to Mongo when the app initializes
mongoose.connect(config.db);

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'))

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

	next();
});

// set up the RESTful API, handler methods are defined in api.js
var api = require('./controllers/api.js');

// app.post('/thread', api.create);
// app.get('/thread/:title.:format?', api.show);
// app.get('/thread', api.list);

app.get('/test-system', function(request, response) {
	response.send('systems functional');
});

app.get('/pipe/thing', api.listThings);
app.get('/pipe/thing/:id', api.getThingById);
app.post('/pipe/thing', api.createThing);

app.get('/pipe/:userId/thing', api.getThingsByUserId);
app.get('/pipe/:userId/thing/:thingId', api.getThingByUserAndThingId);

app.get('/pipe/:userId/widget', api.getWidgetsByUserId);
app.post('/pipe/widget', api.createWidget);
app.get('/pipe/:userId/widget/:widgetId', api.getWidgetByUserAndThingId);
app.put('/pipe/:userId/widget/:widgetId', api.updateWidgetByUserAndThingId);
app.delete('/pipe/:userId/widget/:widgetId', api.deleteWidgetByUserAndThingId);

app.get('/pipe/user', api.listUsers)
app.post('/pipe/user', api.createUser);
app.get('/pipe/user/:id', api.getUserById);


var server = app.listen(port, function() {
	console.log("Express server listening on port %d", server.address().port);
});
