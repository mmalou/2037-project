var app = require('./../app');
var assert = require("assert");
var request = require('supertest');

describe('Tests Acceptations', function(){

	var questionId;
	var questionContent = "question A";
	
	// Ajout d'une question qui n'existe pas
	it('Should return StatusCode 201 when adding a non-existing question', function (done) {
		request(app)
			.post('/questions/')
			.send({ content: questionContent })
			.expect(201)
			.end(function (error, res) {
				
				questionId = res.text;
				if(error) throw error;
				done();
			});
	});
	
	// Consulter une question avec l'id
	it('Should return StatusCode 200 when asking a question with id', function (done) {
		request(app)
			.get('/questions/'+questionId)
			.expect(200)
			.end(function (error, res) {
				if(error) throw error;
				done();
			});
	});

	// Récuperation derniere question si il y en a
	it('Should return StatusCode 200 when asking for an existing last question', function (done) {
		request(app)
			.get('/questions/last')
			.expect(200)
			.end(function (error) {
				if(error) throw error;
				done();
			});
	});
	
	// Ajout d'une question qui existe
	it('Should return StatusCode 200 when adding an existing question', function (done) {
		request(app)
			.post('/questions/')
			.send({ content: questionContent })
			.expect(200)
			.end(function (error) {
				if(error) throw error;
				done();
			});
	});
	
	// Réponse à une question
	it('Should return StatusCode 200 when updating question answer', function (done) {
		request(app)
			.put('/questions/'+questionId)
			.send({ answer: "reponse" })
			.expect(200)
			.end(function (error) {
				if(error) throw error;
				done();
			});
	});
	
	// Remove la question
	it('Should return StatusCode 200 when removing a question', function (done) {
		request(app)
			.delete('/questions/'+questionId)
			.send()
			.expect(200)
			.end(function (error) {
				if(error) throw error;
				done();
			});
	});
	
	// Récuperation derniere question si il n'y en a pas
	it('Should return StatusCode 204 when asking for a non-existing last question', function (done) {
		request(app)
			.get('/questions/last')
			.expect(204)
			.end(function (error) {
				if(error) throw error;
				done();
			});
	});
	
	// Bad request
	it('Should return StatusCode 404 when sending bad url', function (done) {
		request(app)
			.get('/questions/badurl')
			.expect(404)
			.end(function (error) {
				if(error) throw error;
				done();
			});
	});
});