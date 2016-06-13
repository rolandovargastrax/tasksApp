import Ember from 'ember';

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
    var urlCall = "http://localhost:3000/status/" + currentController.taskMode;
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
		}

	}
});
