var Thread = require('../models/thread.js');
var Post = require('../models/post.js');
var Thing = require('../models/thing.js');
var Widget = require('../models/widget.js');
var User = require('../models/user.js');
var jwt    = require('jsonwebtoken');
var app = require('../app.js');

exports.createThing = function(req, res) {
	console.log(req.body);
	var thing = new Thing({
		name: req.body.name,
		owner: req.body.owner,
		value: req.body.value
	});

	thing.save(function (err, thing) {
		if (err){
			return res.json(err);
		}

		else {
			return res.json(thing);
		}
	});
}

exports.listThings = function(req, res) {
	Thing.find(function(err, threads) {
		res.send(threads);
	});
}

exports.getThingById = (function(req, res) {
	Thing.findOne({_id: req.params.id}, function(error, thing) {
		res.send(thing);
	})
});

exports.getThingsByUserId = (function(req, res) {
	console.log(req.params);

	Thing.find({owner: req.params.userId}, function(error, things) {
		res.send(things);
	})
});

exports.getThingByUserAndThingId = (function(req, res) {
	console.log(req.params);

	Thing.find({owner: req.params.userId, _id: req.params.thingId}, function(error, things) {
		res.send(things);
	})
});


//// Widget API //
exports.createWidget = function(req, res) {
	console.log(req.body);
	var widget = new Widget({
		name: req.body.name,
		owner: req.body.owner,
		description: req.body.description || '',
		widgetInfo : req.body.widgetInfo,
		thingType : req.body.thingType || '',
		thingId : req.body.thingId || '',
		buttonLabel : req.body.buttonLabel || '',
		payload : req.body.payload || '',
		components : req.body.components || []
	});

	widget.save(function (err, widget) {
		if (err){
			return res.json(err);
		}

		else {
			return res.json(widget);
		}
	});
}

exports.getWidgetsByUserId = (function(req, res) {
	console.log(req.params);

	Widget.find({owner: req.params.userId}, function(error, widgets) {
		res.send(widgets);
	})
});

exports.getWidgetByUserAndThingId = (function(req, res) {
	console.log(req.params);

	Widget.find({owner: req.params.userId, _id: req.params.widgetId}, function(error, widget) {
		res.send(widget);
	})
});

exports.updateWidgetByUserAndThingId = (function(req, res) {

	var body = req.body;
	var id = req.params.widgetId;

	Widget.findOneAndUpdate({owner: req.params.userId, _id: req.params.widgetId}, { $set: body}, {new: true}, function (error, widget) {
		if (error) {
			return res.json(error);
		}
		res.send(widget);
	});

});

exports.deleteWidgetByUserAndThingId = (function(req, res) {
	console.log(req.params)
	var id = req.params.widgetId;

	Widget.findOneAndRemove({owner: req.params.userId, _id: req.params.widgetId}, function (error, widget) {
		if (error) {
			return res.json(error);
		}
		res.send('widget successfully deleted');
	});

});

//// User API //

exports.createUser = function(req, res) {

	var user = new User({
		name: req.body.name,
        email: req.body.email,
        password: req.body.password,
		status: req.body.status,
	});

    console.log(req.body);

	user.save(function (err, thing) {
		if (err){
			return res.json(err);
		}

		else {
			return res.json(thing);
		}
	});
}

exports.authenticateUser = function(req, res) {
    console.log(req.body);
		User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
            if (user.password !== req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token
                var userInfo = {
									  id : user._id,
                    name : user.name,
                    email: user.email
                }
                var token = jwt.sign(userInfo, app.get('superSecret'), {
                    // expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
										data : userInfo,
                    token: token
                });
            }
        }
  });
}

exports.listUsers = function(req, res) {
	User.find(function(err, things) {
		res.send(things);
	});
}

exports.getUserById = (function(req, res) {
	User.findOne({_id: req.params.id}, function(error, user) {
		res.send(user);
	})
});


// first locates a thread by title, then locates the replies by thread ID.
exports.show = (function(req, res) {
	Thread.findOne({title: req.params.title}, function(error, thread) {
		var posts = Post.find({thread: thread._id}, function(error, posts) {
			res.send([{thread: thread, posts: posts}]);
		});
	})
});
