
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var request = require('request');

app.use(bodyParser.urlencoded({ extended: true })); // pour lire dans l'url grâce à body-parser

app.use("/views/images",express.static(__dirname + "/views/images"));
app.use("/views/fonts",express.static(__dirname + "/views/fonts"));
app.use("/views/js",express.static(__dirname + "/views/js"));
app.use("/views/styles",express.static(__dirname + "/views/styles"));

app.get('/FormClient', function(req, res) {
    res.render('FormClient.ejs');
});

app.post('/FormClientSend', function(req, res) {
	var stringSentName = req.body.name;
	var stringSentQuestion = req.body.question;
	var stringUrlQuestion = "http://localhost:8080/Question/"+stringSentQuestion+"/"+stringSentName;
    res.render('FormClientSend.ejs', {urlQuestion: stringUrlQuestion});	
});

app.get('/Question/:question', function(req, res) {
	// question a récupérer dans le modele grâce à l'url
	var stringQuestion = req.params.question;
	
	// reponse a recuperer dans le modele aussi 
	var stringReponse = "Pas de réponse pour le moment !";
    res.render('ConsultQuestion.ejs', {question: stringQuestion, reponse: stringReponse});
});

app.get('/SystemeExpert', function(req, res) {
	// Recup derniere question
	var stringLastQuestion = "QUESTION";
    res.render('SystemeExpert.ejs', {question: stringLastQuestion});
});

app.post('/SystemeExpertReponse', function(req, res) {

});

app.get('/TestReqServ', function(req, res) {
	request
	.get('http://localhost:8081/TestReqServ')
	.on('response', function(response) {
	console.log(response.statusCode) // 200 
	console.log(response.headers['content-type']) // 'image/png' 
	})
	.pipe(request.put('http://localhost:8080/img.png'))
});



app.listen(8080);

//server.close();