var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var mongodbUri = 'mongodb://admin:375yqkTE@ds053638.mongolab.com:53638/interface2037';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
var mongoose = require('mongoose');
var db = mongoose.connection;
mongoose.connect(mongooseUri);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	//console.log("Connection ok");
});

var schema = mongoose.Schema({ content : 'String', status : 'String', date_creation : 'Date', answer : 'String'});
var Question = mongoose.model('Question', schema);

module.exports = {
	add: function(content, callback) {
		var datetime = new Date();
		var newQuestion = new Question({ content : content , status : 'waiting', date_creation : datetime, answer : ''});
		newQuestion.save(function (err,doc) {
			if (err) 
				callback("error");
			callback(doc)
		});
	},
	clean: function(callback) {
		Question.remove(function(err) {
			if (err) 
				callback("error");
			callback("ok")
		});
	},
	remove: function(id, callback) {
		Question.remove({ _id: id }, function(err) {
			if (err) 
				callback("error");
			callback("ok")
		});
	},
	findByContent: function(content, callback) {
		Question.find({ content : content }, function (err, doc){
			if (err) 
				callback("error");
			callback(doc[0]);
		});
	},
	findById: function(id, callback) {
		Question.findById(id, function (err, doc){
			if (err) 
				callback("error");
			callback(doc);
		});
	},
	getNext: function(callback) {
		var query = Question.find({ status : "waiting" }).limit(1).sort([['date_creation', 'descending']]);
		query.exec(function(err, doc) {
			if(err)
				callback("error");
			callback(doc[0]);
		});
	},
	answer: function(id, answer, callback) {
		var idQuestion = { _id : id };
		var update = { status : "answered", answer : answer };
		var options_update;
		Question.update(idQuestion, update, options_update, callback_update);
		function callback_update (err, numAffected) {
			if(err || numAffected == 0)
				callback("error");
			callback("ok");
		}
	},
	lock: function(id, callback) {
		var idQuestion = { _id : id };
		var update = { status : "in progress"};
		var options_update;
		Question.update(idQuestion, update, options_update, callback_update);
		function callback_update (err, numAffected) {
			if(err || numAffected == 0)
				callback("error");
		}
		callback("ok");
	},
};