var app = require('./../app');
var assert = require("assert");
var request = require('supertest');

describe('Tests Acceptations', function(){

	// ajout d'une question qui n'existe pas
	it('Should return a 201 status code', function (done) {
		request(app)
			.post('/questions/')
			.send({ content: questionContent })
			.expect(201)
			.end(function (error) {
				if(error) throw error;
				done();
			});
	});

	// Récuperation derniere question si il n'y en a pas
	it('Should return a 204 status code', function (done) {
		request(app)
			.get('/questions/last')
			.expect(204)
			.end(function (error) {
				if(error) throw error;
				done();
			});
	});

	// Récuperation derniere question si il y en a
	it('Should return a 200 status code', function (done) {
		request(app)
			.get('/questions/last')
			.expect(200)
			.end(function (error) {
				if(error) throw error;
				done();
			});
	});

	var questionContent = 'contenu question';

	// ajout d'une question qui existe
	it('Should return a 200 status code', function (done) {
		request(app)
			.post('/questions/')
			.send({ content: questionContent })
			.expect(200)
			.end(function (error) {
				if(error) throw error;
				done();
			});
	});
});