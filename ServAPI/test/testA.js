var app = require('./../app');
var chai = require('chai');
var assert = chai.assert;
var request = require('supertest');

describe('Tests Acceptations', function(){

	var questionContent = "question A";
	var location;
	var questionAnswer = "reponse";
	
	// Ajout d'une question qui n'existe pas
	it('Should return StatusCode 201 when adding a non-existing question', function (done) {
		request(app)
			.post('/questions/')
			.send({ content: questionContent })
			.expect(201)
			.end(function (error, res) {
				var regex = "\/questions\/[a-zA-Z0-9]*";
				location = res.headers.location.match(regex)[0];
				request(app)
					.get(location)
					.expect(200)
					.end(function (error, res) {
						if(error) throw error;
					});
				if(error) throw error;
				done();
			});
	});
	
	// Consulter une question non répondue
	it('Should return StatusCode 200 when asking an unanswered question', function (done) {
		request(app)
			.get(location)
			.expect(200)
			.end(function (error, res) {
				assert(res.body.content == questionContent);
				assert.typeOf(res.body.status, "string");
				assert(res.body.answer == "");
				if(error) throw error;
				done();
			});
	});

	// Récuperation derniere question si il y en a
	it('Should return StatusCode 200 when asking for an existing last question', function (done) {
		request(app)
			.get('/questions/')
			.expect(200)
			.end(function (error, res) {
				var regex = "\/questions\/[a-zA-Z0-9]*";
				location = res.headers.location.match(regex)[0];
				request(app)
					.get(location)
					.expect(200)
					.end(function (error, res) {
						if(error) throw error;
					});
				if(error) throw error;
				done();
			});
	});
	
	// Réponse à une question
	it('Should return StatusCode 200 when updating question answer', function (done) {
		request(app)
			.post(location)
			.send({ answer: questionAnswer })
			.expect(200)
			.end(function (error) {
				if(error) throw error;
				done();
			});
	});
	
	// Consulter une question répondue
	it('Should return StatusCode 200 when asking an answered question', function (done) {
		request(app)
			.get(location)
			.expect(200)
			.end(function (error, res) {
				assert(res.body.content == questionContent);
				assert.typeOf(res.body.status, "string");
				assert(res.body.answer == questionAnswer);
					if(error) throw error;
				done();
			});
	});
	
	// Remove la question
	it('Should return StatusCode 200 when removing a question', function (done) {
		request(app)
			.delete(location)
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
			.get('/questions/')
			.expect(204)
			.end(function (error) {
				if(error) throw error;
				done();
			});
	});
	
	// Bad request
	it('Should return StatusCode 400 when sending bad url', function (done) {
		request(app)
			.get('/badurl')
			.expect(400)
			.end(function (error) {
				if(error) throw error;
				done();
			});
	});
});