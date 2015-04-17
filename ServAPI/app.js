var http = require('http')
var url = require('url')
var querystring = require('querystring')
var express = require('express')
var bodyParser = require('body-parser')
var app = express();
var mongomodel = require(__dirname +"/models/mongomodel.js");

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/questions/:idquestion', function(req, res) {
	mongomodel.findById(req.params.idquestion, function(resultFind){
		if(resultFind == "error" || resultFind == null){
			res.statusCode = 404;
			res.send("Not Found");
		}
		else {
			if(resultFind.status == "waiting" || resultFind.status == "in progress") {
				console.log(204);
				res.statusCode = 204;
				res.send();
			}
			else {
				console.log(200);
				var sortObject = {content: resultFind.content, status: resultFind.status, answer: resultFind.answer}
				res.statusCode = 200;
				res.send(sortObject);
			}
		}
	});
});

app.post('/questions/:idQuestion', function(req, res) {
	var questionAnswer = req.body.answer;
	mongomodel.answer(req.params.idQuestion,questionAnswer,function(resultFind){
		if(resultFind == "error" || resultFind == null){
			res.statusCode = 500;
			res.send("Internal Server Error");
		}
		else{
			res.statusCode = 200;
			res.send(resultFind);
		}
	});
});

app.delete('/questions/:idQuestion', function(req, res) {
	mongomodel.remove(req.params.idQuestion,function(resultFind){
		if(resultFind == "error" || resultFind == null){
			res.statusCode = 400;
			res.send(resultFind);
		}
		else{
			res.statusCode = 200;
			res.send(resultFind);
		}
	});
});

app.get('/questions/', function(req, res) {
	mongomodel.getNext(function(resultFind){
		if(typeof resultFind == 'undefined' || resultFind == null) {
			res.statusCode = 204;
			res.send();
		}
		else{
			mongomodel.lock(resultFind._id,function(resultLock){
				if(resultFind == "error"){
					res.statusCode = 500;
					res.send("Internal Server Error");
				}
				else {
					if(resultFind == "undefined") {
						res.statusCode = 204;
						res.send();
					}
					else{
						var sortObject = {content: resultFind.content}
						res.statusCode = 200;
						res.location("http://localhost:8081/questions/"+resultFind.id);
						res.send(sortObject);
					}
				}
			});
		}
	});
});

app.post('/questions/', function(req, res) {
	var questionContent = req.body.content;
	mongomodel.add(questionContent,function(resultAdd){
		if (resultAdd == "error") {
			res.statusCode = 500;
			res.send();
		}
		else {
			res.statusCode = 201;
			res.location("http://localhost:8081/questions/"+resultAdd.id);
			res.send();
		}
	});
});

app.delete('/questions/', function(req, res) {
	mongomodel.clean(function(resultFind){
		if(resultFind == "error" || resultFind == null){
			res.statusCode = 400;
			res.send(resultFind);
		}
		else{
			res.statusCode = 200;
			res.send(resultFind);
		}
	});
});

app.use(function(req, res) {
	res.statusCode = 400;
	res.send("Bad Request");
});

module.exports = app;

//server.close();