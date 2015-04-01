var http = require('http')
var url = require('url')
var querystring = require('querystring')
var express = require('express')
var bodyParser = require('body-parser')
var app = express();
var mongomodel = require(__dirname +"/models/mongomodel.js");

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/questions/last', function(req, res) {
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
				else{
					
					if(resultFind == "undefined") {
						res.statusCode = 204;
						res.send();
					}
					else{
						res.statusCode = 200;
						res.send(resultFind); // pas besoin de renvoyé ça nn ?
					}
				}
			});
		}
	});
});

app.get('/questions/:idquestion', function(req, res) {
	mongomodel.findById(req.params.idquestion, function(resultFind){
		console.log("serv");
		console.log(resultFind);
		if(resultFind == "error" || resultFind == null){
			res.statusCode = 404;
			res.send("Not Found");
		}
		else {
			res.statusCode = 200;
			res.send(resultFind);
		}
	});
});

app.put('/questions/:idQuestion', function(req, res) {
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


app.post('/questions/', function(req, res) {
	var questionContent = req.body.content;
	mongomodel.findByContent(questionContent,function(resultFind){
		if(resultFind == "error"){
			res.statusCode = 500;
			res.send(resultFind);
		}
		else{
			if(resultFind == undefined){
				console.log("3");
				mongomodel.add(questionContent,function(resultAdd){
					if (resultAdd == "error") {
						res.statusCode = 500;
						res.send();
					}
					else {
						res.statusCode = 201;
						res.send(resultAdd.id);
					}
				});
			}
			else
			{
				console.log("6");
				res.statusCode = 200;
				res.send(resultFind.id);
			}
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