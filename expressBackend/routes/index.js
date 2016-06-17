var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient
var assert = require('assert')
var ObjectId = require('mongodb').ObjectId
var url = 'mongodb://localhost:27017/test'

var getTasksImplementation = function(res, status, sortField, direction){
	// connect to mongo database
	MongoClient.connect(url, function(err, db){
		if(db == null){
			res.status(500).send("Error connecting to database");
			return;
		}
		if(direction === null){
			direction = 1;
		}
		if(sortField === null){
			sortField = "creationDate";
		}
		sortJson = {}
		sortJson[sortField] = parseInt(direction);

		cursor = db.collection('tasks').find({"status": status}, {sort: sortJson});

		cursor.toArray( function(err, items){
			// console.log('Tasks converted to array successfully');
			db.close();
			if( items != null ){
				// update each task to expose the date parts
				for (var currentItem = items.length - 1; currentItem >= 0; currentItem--) {
					// populate the formatted creationDate
					if(items[currentItem].creationDate != null){
						try{
							items[currentItem].creationDateStr = items[currentItem].creationDate.getFullYear() + '.' + ('00' + (items[currentItem].creationDate.getMonth() + 1)).slice(-2) + '.' + ('00' + items[currentItem].creationDate.getDate()).slice(-2);
						}catch(ex){;}
					}
					// populate the formatted completeDate
					if(items[currentItem].completeDate != null){
						try{
							items[currentItem].completeDateStr = items[currentItem].completeDate.getFullYear() + '.' + ('00' + (items[currentItem].completeDate.getMonth() + 1)).slice(-2) + '.' + ('00' + items[currentItem].completeDate.getDate()).slice(-2);
						}catch(ex){;}
					}
				}
				// prepare the results to be returned
				result = {}
				result.items = items
				res.json(result);
			}
			else{
				result = {}
				result.items = [];
				res.json(result);
			}
		});
	});
};


// filters the tasks by status
router.get('/status/:status', function(req, res, next) {
	getTasksImplementation(res, req.params.status, "name", 1);
});
router.get('/status/:status/:sortField', function(req, res, next) {
	getTasksImplementation(res, req.params.status, req.params.sortField, 1);
});
router.get('/status/:status/:sortField/:direction', function(req, res, next) {
	getTasksImplementation(res, req.params.status, req.params.sortField, req.params.direction);
});



// delete all the tasks for a given status
router.delete('/status/:status', function(req, res, next) {
	// connect to the mongo database
	MongoClient.connect(url, function(err, db){
		if(db == null){
			res.status(500).send("Error connecting to database");
			return;
		}
		// assert.equal(null, err);
		// console.log('Connected correctly to server.');
		// call the find method
		cursor = db.collection('tasks').deleteMany({"status": req.params.status}, function(err, results){
			res.status(200).send("Tasks deleted successfully");
			db.close();
		});
	});
});

// get task details
router.get('/task/:taskId', function(req, res){
	// connect to the database
	MongoClient.connect(url, function(err, db){
		if(db == null){
			res.status(500).send("Error connecting to database");
			return;
		}

		// console.log('Connected correctly to server.');
		doc = db.collection('tasks').findOne({"_id": ObjectId(req.params.taskId)}, function(err, doc){
			res.json(doc);
			db.close();
		});
	});
});

// updates an existing task
router.post('/task/:taskId', function(req, res){
	request = req.body;

	// build update request
	setJson = {};
	fieldsToUpdate = {};
	fieldsToUpdate.completeDate = new Date();
	if(request.name != null && request.name.length > 0)
	{
		fieldsToUpdate.name = request.name
	}
	if(request.status != null && request.status.length > 0)
	{
		fieldsToUpdate.status = request.status;
	}
	if(request.project != null && request.project.length > 0)
	{
		fieldsToUpdate.project = request.project;
	}
	setJson.$set = fieldsToUpdate;

	return MongoClient.connect(url, function(err,db){
		if(db == null){
			res.status(500).send("Error connecting to database");
			return;
		}
		// assert.equal(null, err);
		// console.log('Connected correctly to server.');
		// db.collection('tasks').update({"_id": ObjectId(req.params.taskId)},   { $set: { "status": newStatus, "completeDate": new Date() } }, function(err){
		db.collection('tasks').update({"_id": ObjectId(req.params.taskId)}, setJson, function(err){
			// console.log('Task updated successfully');
			db.close();
			res.status(200).send("Task updated successfully");
		});
	});
});

// adds a new task
router.put('/task/', function(req, res){
	// todo: check if the task is already there first?

	// console.log(req.body);
	// res.json(req.body);
	newTask = req.body;
	newTask.status = "pending";
	newTask.creationDate = new Date();
	// res.json(newTask);
	// return;
	return MongoClient.connect(url, function(err, db){
		if(db == null){
			res.status(500).send("Error connecting to database");
			return;
		}
		// assert.equal(null, err);
		// console.log('Connected correctly to server.');
		db.collection('tasks').insertOne(newTask, function(err){
			assert.equal(null, err);
			// console.log('task inserted successfully');
			db.close();
			res.status(200).send("task inserted successfully");
		});
	});
});

module.exports = router;
