var chai = require('chai');
var assert = chai.assert;
var mongomodel = require("../models/mongomodel.js");


describe('Tests Unitaires', function(){

	mongomodel.clean(function(resultFind){});
	
	var question;
	
	// test add
	it('Should create a question', function(done){
		mongomodel.add("question",function(resultAdd){
			assert.typeOf(resultAdd.id, "string");
			assert.equal("question", resultAdd.content);
			assert.equal("waiting",resultAdd.status);
			assert.typeOf(resultAdd.date_creation,"date");
			assert.equal("",resultAdd.answer);
			question = resultAdd;
			done();
		})
	})
	
	
	// test findbyid
	it('Should return same question object by id', function(done){
		mongomodel.findById(question.id,function(resultFind){
			assert.equal(resultFind.id, question.id);
			assert.equal(resultFind.content, question.content);
			assert.equal(resultFind.status, question.status);
			assert.equal(resultFind.dateCreation, question.dateCreation);
			assert.equal(resultFind.answer, question.answer);
			done();
		})
	})

	
	// test findbycontent
	it('Should return same question object by content', function(done){
		mongomodel.findByContent(question.content,function(resultFind){
			assert.equal(resultFind.id, question.id);
			assert.equal(resultFind.content, question.content);
			assert.equal(resultFind.status, question.status);
			assert.equal(resultFind.dateCreation, question.dateCreation);
			assert.equal(resultFind.answer, question.answer);
			done();
		})
	})
	
	// test getnext
	it('Should return question with new answer', function(done){
		mongomodel.getNext(function(resultFind){
			assert.equal(resultFind.id, question.id);
			assert.equal(resultFind.content, question.content);
			assert.equal(resultFind.status, question.status);
			assert.equal(resultFind.dateCreation, question.dateCreation);
			assert.equal(resultFind.answer, question.answer);
			done();
		})
	})
	
	// test lock
	it('Should update question status', function(done){
		mongomodel.lock(question.id,function(resultFind){
			mongomodel.findById(question.id,function(resultFind){
				assert.equal("in progress", resultFind.status);
				done();
			})
		})
	})
	
	// test answer
	it('Should update question answer', function(done){
		mongomodel.answer(question.id,"reponse",function(resultFind){
			mongomodel.findById(question.id,function(resultFind){
				assert.equal("reponse", resultFind.answer);
				done();
			})
		})
	})
});