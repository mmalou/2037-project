var assert = require("assert"); // node.js core module
var mongomodel = require("../models/mongomodel.js");


describe('Array', function(){
	describe('#indexOf()', function(){

		// test add
		it('Should create a question', function(){
			mongomodel.add("question",function(resultAdd){
				assert.typeOf(resultAdd._id, 'string');
				assert.equal("resultAdd",resultAdd.content);
				assert.equal("resultAdd",resultAdd.status);
				assert.typeOf(resultAdd.dateCreation,"date");
				assert.equal("",resultAdd.answer);
			})
		})

		// test findbyid
		it('Should return same question object by id', function(){
			mongomodel.add("question",function(resultAdd){
				mongomodel.findById(resultAdd._id,function(resultFind){
					assert.equal(resultFind._id, resultAdd._id);
					assert.equal(resultFind.content, resultAdd.content);
					assert.equal(resultFind.status, resultAdd.status);
					assert.equal(resultFind.dateCreation, resultAdd.dateCreation);
					assert.equal(resultFind.answer, resultAdd.answer);
				})
			})
		})

		// test findbycontent
		it('Should return same question object by content', function(){
			mongomodel.add("question",function(resultAdd){
				mongomodel.findByContent(resultAdd.content,function(resultFind){
					assert.equal(resultFind._id, resultAdd._id);
					assert.equal(resultFind.content, resultAdd.content);
					assert.equal(resultFind.status, resultAdd.status);
					assert.equal(resultFind.dateCreation, resultAdd.dateCreation);
					assert.equal(resultFind.answer, resultAdd.answer);
				})
			})
		})

		// test getnext
		it('Should return question with new answer', function(){
			mongomodel.add("question",function(resultAdd){
				mongomodel.getnext(function(resultFind){
					assert.equal(resultFind._id, resultAdd._id);
					assert.equal(resultFind.content, resultAdd.content);
					assert.equal(resultFind.status, resultAdd.status);
					assert.equal(resultFind.dateCreation, resultAdd.dateCreation);
					assert.equal(resultFind.answer, resultAdd.answer);
				})
			})
		})
		
		// test answer
		it('Should update question answer', function(){
			mongomodel.add("question",function(resultAdd){
				mongomodel.answer(resultAdd._id,"reponse",function(resultFind){
					mongomodel.findById(resultAdd._id,function(resultFind){
						assert.equal("reponse", resultFind.answer);
					})
				})
			})
		})
		
		// test lock
		it('Should update question status', function(){
			mongomodel.add("question",function(resultAdd){
				mongomodel.lock(resultAdd._id,function(resultFind){
					mongomodel.findById(resultAdd._id,function(resultFind){
						assert.equal("in progress", resultFind.status);
					})
				})
			})
		})
	})
});