import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({
	newTasKName: '',
	validationMessage: '',
	editingTask: {},
	selectedProject: '',
	filteredProject: '',

	tasks: Ember.computed('model', function() {
		var finalResult = [];
		var data = this.get('model');
		for (var currentTask = data.items.length - 1; currentTask >= 0; currentTask--) {
			if(this.filteredProject.length > 0){
				if(data.items[currentTask].project === this.filteredProject){
					finalResult.push(data.items[currentTask]);
				}
			}
			else{
				finalResult.push(data.items[currentTask]);
			}
		}
		return finalResult;
	}),

	projects: Ember.computed('tasks', function() {
    // remove previously selected project
    // this.set('selectedProject', '');

		// build list of unique projects for dropdown
		var projectList = [];
		var data = this.get('tasks');
		for (var i = data.length - 1; i >= 0; i--) {
			var currentItemProject = data[i].project;
			if(currentItemProject != null && currentItemProject.length > 0){
				if(!projectList.includes(currentItemProject)){
					projectList.push(currentItemProject);
				}
			}
		}
		projectList = projectList.sort(-1);
		return projectList;
	}),

	actions:{

		selectProject: function(proj){
      this.set('selectedProject', proj);
      this.set('filteredProject', proj);
      this.send('refreshModel');
    },

    filterProject: function(proj){
      this.set('selectedProject', proj);
      this.set('filteredProject', proj);
      this.send('refreshModel');
		},

		removeFilterProject: function(){
      this.set('filteredProject', '');
			this.set('selectedProject', '');
			this.send('refreshModel');
		},

		addNewTask: function(){
			var currentController = this;
			// var model = currentController.get('model');
			var newTasKName = currentController.get('newTasKName');
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
				newTask.project = currentController.selectedProject;
				newTask.creationDate = new Date();

				// add new task to mongo
				Ember.$.ajax({
					type: "PUT",
					url: ENV.backEndBaseUrl,
					data: newTask
					}).then(function(){
					// }).then(function(response){
						currentController.set('newTasKName', '');
						currentController.send('refreshModel');
					});
			}
		},

		setCurrentTaskEditing: function(currentTask){
			// make a copy of the object so the modal window doesn't update the grid as well
			var clonedObject = JSON.parse(JSON.stringify(currentTask));
			Ember.set(this, 'editingTask', clonedObject);
		},

		getYear: function(date) {
			date.getFullYear();
		},

		refreshModel: function() {
			// console.log('Controller requesting route to refresh...');
			this.send('reloadModel');
		},

		updateTask: function(){
			var reqBody = {};
			reqBody.name = this.editingTask.name;
			reqBody.project = this.editingTask.project;
			var taskId = this.editingTask._id;
			var url = ENV.backEndBaseUrl + taskId;

			// call the mongo service to update the task as complete
			var currentController = this;
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

		updateTaskAsComplete: function(task){
			var currentController = this;
			var reqBody = {};
			reqBody.status = 'complete';
			var taskId = task._id;
			var url = ENV.backEndBaseUrl + taskId;

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
			var reqBody = {};
			reqBody.status = 'cancelled';
			var taskId = task._id;
			// console.log(url);
      var url = ENV.backEndBaseUrl + taskId;

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
