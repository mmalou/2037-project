var http = require('http')
var url = require('url')
var querystring = require('querystring')
var express = require('express')
var bodyParser = require('body-parser')
var app = express();
var mongomodel = require(__dirname +"/models/mongomodel.js");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/*
* Expert
*/

app.post('/lastQuestion', function(req, res) {
	mongomodel.getNext(function(resultFind){
		console.log(resultFind);
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

app.post('/updateQuestion/:idQuestion/:answer', function(req, res) {
	mongomodel.answer(req.params.idQuestion,req.params.answer,function(resultFind){
		if(resultFind == "error"){
			res.statusCode = 500;
			res.send("Internal Server Error");
		}
		else{
			res.statusCode = 200;
			res.send(resultFind);
		}
	});
});


/*
* CLIENT
*/
app.post('/:question', function(req, res) {
	mongomodel.findByContent(req.params.question,function(resultFind){
		if(resultFind == "error"){
			res.statusCode = 500;
			res.send("Internal Server Error");
		}
		else{
			if(resultFind == undefined){
				mongomodel.add(req.params.question,function(resultAdd){
					if (resultAdd == "error") {
						res.statusCode = 500;
						res.send();
					}
					else {
					res.statusCode = 201;
					res.send(resultAdd._id);
					console.log('id_question='+resultAdd._id+' (pour question : '+resultAdd.content+')');
					}
				});
			}
			else
			{
				res.statusCode = 200;
				res.send(resultFind._id);
				console.log('id_question='+resultFind._id+' (pour question : '+resultFind.content+')');
			}
		}
	});
});

app.post('/find/:idquestion', function(req, res) {
	mongomodel.findById(req.params.idquestion, function(resultFind){
		if(resultFind == "error"){
			res.statusCode = 404;
			res.send("Not Found");
		}
		else {
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