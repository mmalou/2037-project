var http = require('http');
var url = require('url');
var querystring = require('querystring');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var request = require('request');

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/views/images",express.static(__dirname + "/views/images"));
app.use("/views/fonts",express.static(__dirname + "/views/fonts"));
app.use("/views/js",express.static(__dirname + "/views/js"));
app.use("/views/styles",express.static(__dirname + "/views/styles"));

var path = "http://localhost:8081";

// Form a remplir pour envoyer la question
app.get('/Client', function(req, res) {
    res.render('FormClient.ejs');
});

// arrive là  aprés avoir envoyer la question
app.post('/Client/Envoi', function(req, res) {
	var data = { content: req.body.question };
	var options = {
		method: 'post',
		form: data,
		url:path+'/questions/'
	};
	
	request(options, function (err, httpResponse, body) {
		if (!err){
			if (httpResponse.statusCode == 201 || httpResponse.statusCode == 200 ) {
				res.render('FormClientSent.ejs', {urlQuestion: "http://localhost:8080/Client/"+JSON.parse(body)});	
			}
			else {
				res.render('ErrorPage.ejs', { error: httpResponse.statusCode, errorContent: body });
			}
		}
	});
});

// Pour consulter la réponse
app.get('/Client/:idquestion', function(req, res) {	
	var options = {
		method: 'get',
		url:path+'/questions/'+req.params.idquestion
	};
	
	request(options, function (err, httpResponse, body) {
		if (!err && httpResponse.statusCode == 200) {
			console.log("client");
			console.log(body);
			var results = JSON.parse(body);
			var stringQuestion = "Question : "+results.content;
			if(results.status == "waiting" || results.status == "in progress"){
				var stringReponse = "Pas de réponse pour le moment !";
				res.render('ConsultQuestion.ejs', {question: stringQuestion, reponse: stringReponse});
			}
			else{
				var stringReponse = "Réponse : "+results.answer;
				res.render('ConsultQuestion.ejs', {question: stringQuestion, reponse: stringReponse});
			}			
		}
		else{
			res.render('ErrorPage.ejs', { error: httpResponse.statusCode, errorContent: body });
		}
	});
});

app.get('/SystemExpert/clean', function(req, res) {	
	var options = {
		method: 'delete',
		url:path+'/questions/'
	};
	
	request(options, function (err, httpResponse, body) {
		res.render('ErrorPage.ejs', { error: httpResponse.statusCode, errorContent: body });
	});
});


app.get('/SystemeExpert', function(req, res) {
	var options = {
		method: 'get',
		url:path+'/questions/last'
	};
	
	request(options, function (err, httpResponse, body) {
		if (!err) {
			if(httpResponse.statusCode == 200){
				console.log("200");
				var results = JSON.parse(body);
				res.render('SystemeExpert.ejs', {idQuestion: results._id, question: results.content});
			}
			else if(httpResponse.statusCode == 204){
				console.log("204");
				res.render('SystemeExpert.ejs', {idQuestion: "noQuestion" , question: ""});
			}
		}
		else {
			res.render('ErrorPage.ejs', { error: httpResponse.statusCode, errorContent: body });
		}
	});
});

app.post('/SystemeExpert/Envoi', function(req, res) {
	var data = { answer: req.body.answer };
	var options = {
		method: 'put',
		form: data,
		url:path+'/questions/'+req.body.idQuestion
	};
	
	request(options, function (err, httpResponse, body) {
		if (!err && httpResponse.statusCode == 200) {
			res.render('SystemeExpertSent.ejs');	// rajouter bouton dans systemeExpertResponse.js pour revenir a la page de réponse
		}
		else {
			res.render('ErrorPage.ejs', { error: httpResponse.statusCode, errorContent: body });
		}
	});
});

app.get('/SystemExpert/:idQuestion', function(req, res) {	
	var options = {
		method: 'delete',
		url:path+'/questions/'+req.params.idQuestion
	};
	
	request(options, function (err, httpResponse, body) {
		res.render('ErrorPage.ejs', { error: httpResponse.statusCode, errorContent: body });
	});
});


app.use(function(req, res) {
	res.render('ErrorPage.ejs', { error: 404, errorContent: "Not Found" });
});

app.listen(8080);