import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({

	tasks: Ember.computed('model', function() {
		var data = this.get('model');
		return data;
	}),
	taskMode: '',

	actions:{

		refreshModel: function() {
			// console.log('Controller requesting route to refresh...');
			this.send('reloadModel');
		},

		deleteAllTasks: function(){
		var currentController = this;
		var urlCall = ENV.backEndBaseUrl + "status/" + currentController.taskMode;
			// console.log(urlCall);
			// delete the tasks from mongo
			Ember.$.ajax({
				type: "DELETE",
				url: urlCall
				}).then(function(){
					currentController.send('refreshModel');
				});
		},

	setTaskMode: function(taskMode){
		var currentController = this;
		currentController.set('taskMode', taskMode);
		},

  resurrectTask: function(task){
      var currentController = this;
      var reqBody = {};
      reqBody.status = 'pending';
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

	deleteTask: function(task){
			var currentController = this;
			var reqBody = {};
			var taskId = task._id;
			var url = ENV.backEndBaseUrl + taskId;

			// call the mongo service to update the task as complete
			Ember.$.ajax({
				type: "DELETE",
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
