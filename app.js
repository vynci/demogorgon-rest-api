var express = require('express')
, mongoose = require('mongoose')
, app = module.exports = express()
, cors = require('cors')
, bodyParser = require('body-parser')
, methodOverride = require('method-override')

, env = process.env.NODE_ENV || 'development'
, config = require('./config')[env]

var jwt    = require('jsonwebtoken');
var port = Number(process.env.PORT || 3000);

// connect to Mongo when the app initializes
mongoose.connect(config.db);

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'))

app.use(cors());

// app.use(function(req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//
// 	next();
// });

app.set('superSecret', 'laser-secret');

var api = require('./controllers/api.js');
var apiRoutes = express.Router();

app.get('/test-system', function(request, response) {
	response.send('systems functional');
});

// app.get('/pipe/user', api.listUsers)
app.post('/pipe/user', api.createUser);
// app.get('/pipe/user/:id', api.getUserById);

app.post('/pipe/authenticate', api.authenticateUser);

apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token

  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['Authorization'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});

app.use('/pipe', apiRoutes);

app.put('/pipe/user/:userId', api.updateUser);


//thing routes//
app.get('/pipe/thing', api.listThings);
app.get('/pipe/thing/:id', api.getThingById);
app.post('/pipe/thing', api.createThing);

app.get('/pipe/:userId/thing', api.getThingsByUserId);
app.get('/pipe/:userId/thing/:thingId', api.getThingByUserAndThingId);

app.put('/pipe/:userId/thing/:thingId', api.updateThingByUserIdAndThingId);
app.delete('/pipe/:userId/thing/:thingId', api.deleteThingByUserIdAndThingId);

///widget routes//
app.get('/pipe/:userId/widget', api.getWidgetsByUserId);
app.post('/pipe/widget', api.createWidget);

app.get('/pipe/:userId/widget/:widgetId', api.getWidgetByUserAndWidgetId);
app.get('/pipe/:userId/widgetByThing/:thingId', api.getWidgetByUserAndThingId);

app.put('/pipe/:userId/widget/:widgetId', api.updateWidgetByUserAndThingId);
app.delete('/pipe/:userId/widget/:widgetId', api.deleteWidgetByUserAndThingId);

var server = app.listen(port, function() {
	console.log("Express server listening on port %d", server.address().port);
});
