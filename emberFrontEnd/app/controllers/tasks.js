import Ember from 'ember';

export default Ember.Controller.extend({
	newTasKName: '',
	validationMessage: '',

	tasks: Ember.computed('model', function() {
		var data = this.get('model');
		return data.items;
	}),

	actions:{
		addNewTask: function(){
			var currentController = this;
			// var model = currentController.get('model');
			var newTasKName = currentController.get('newTasKName');
			// console.log(newTasKName);
			if(!newTasKName){
			// set error message
			currentController.set('validationMessage', 'Please provide a task name.');
			return;
			}
			else {
			// clear error message
			currentController.set('validationMessage', '');

			// create a new task object to submit to mongo
			var newTask = {};
			newTask.name = newTasKName;
			newTask.status = 'pending';
			newTask.creationDate = new Date();

			// add new task to mongo
			Ember.$.ajax({
				type: "PUT",
				url: "http://localhost:3000/task",
				data: newTask
				}).then(function(){
				// }).then(function(response){
					// console.log(response);
					currentController.set('newTasKName', '');
					currentController.send('refreshModel');
				});
			}
		},

		getYear: function(date) {
			date.getFullYear();
		},

		refreshModel: function() {
			// console.log('Controller requesting route to refresh...');
			this.send('reloadModel');
		},

		updateTaskAsComplete: function(task){
			var currentController = this;
			// console.log('task:' + JSON.stringify(task));
			var reqBody = {};
			reqBody.status = 'complete';
			var taskId = task._id;
			var url = "http://localhost:3000/task/" + taskId;
			// console.log(url);

			// call the mongo service to update the task as complete
			Ember.$.ajax({
				type: "POST",
				url: url,
				data: reqBody
				}).then(function(){
				// }).then(function(response){
					// console.log(response);
					// refresh the list
					currentController.send('refreshModel');
					});
		},

		updateTaskAsCancelled: function(task){
			var currentController = this;
			// console.log('task:' + JSON.stringify(task));
			var reqBody = {};
			reqBody.status = 'cancelled';
			var taskId = task._id;
			var url = "http://localhost:3000/task/" + taskId;
			// console.log(url);

			// call the mongo service to update the task as complete
			Ember.$.ajax({
				type: "POST",
				url: url,
				data: reqBody
				}).then(function(){
				// }).then(function(response){
					// console.log(response);
					// refresh the list
					currentController.send('refreshModel');
					});
		}

	}
});
