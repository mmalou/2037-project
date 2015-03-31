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

// Form a remplir pour envoyer la question
app.get('/Client', function(req, res) {
    res.render('FormClient.ejs');
});

// arrive là  aprés avoir envoyer la question
app.post('/Client/Envoi', function(req, res) {
	var stringSentName = req.body.name;
	var stringSentQuestion = req.body.question;
	request.post('http://localhost:8081/'+stringSentQuestion, function(err,httpResponse,body) {
		if (!err){
			if (httpResponse.statusCode == 201 || httpResponse.statusCode == 200 ) {
				res.render('FormClientSent.ejs', {urlQuestion: "http://localhost:8080/Client/"+JSON.parse(body)});	
			}
			else {
				res.render('ErrorPage.ejs', { error: httpResponse.statusCode, errorContent: body });
			}
		}
	})
});

// Pour consulter la réponse
app.get('/Client/:idquestion', function(req, res) {
	var stringIdQuestion = req.params.idquestion;
	
	request.post('http://localhost:8081/find/'+stringIdQuestion, function(err,httpResponse,body) {
		if (!err && httpResponse.statusCode == 200) {
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
	})
});

app.get('/SystemeExpert', function(req, res) {
	request.post('http://localhost:8081/lastQuestion', function(err,httpResponse,body) {
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
	})
});

app.post('/SystemeExpert/Envoi', function(req, res) {
	request.post("http://localhost:8081/updateQuestion/"+req.body.idQuestion+"/"+req.body.answer, function(err,httpResponse,body) {
		if (!err && httpResponse.statusCode == 200) {
			res.render('SystemeExpertSent.ejs');	// rajouter bouton dans systemeExpertResponse.js pour revenir a la page de réponse
		}
		else {
			res.render('ErrorPage.ejs', { error: httpResponse.statusCode, errorContent: body });
		}
	})
 

});


app.use(function(req, res) {
	res.render('ErrorPage.ejs', { error: 404, errorContent: "Not Found" });
});

app.listen(8080);