import Ember from 'ember';

export default Ember.Controller.extend({

	tasks: Ember.computed('model', function() {
		var data = this.get('model');
		return data;
	}),

	actions:{

		refreshModel: function() {
			// console.log('Controller requesting route to refresh...');
			this.send('reloadModel');
		},

	deleteAllCancelledTasks: function(){
		var currentController = this;
		// delete the tasks from mongo
		Ember.$.ajax({
			type: "DELETE",
			url: "http://localhost:3000/status/cancelled"
			}).then(function(){
				currentController.send('refreshModel');
			});
		},

	deleteAllCompleteTasks: function(){
		var currentController = this;
		// delete the tasks from mongo
		Ember.$.ajax({
			type: "DELETE",
			url: "http://localhost:3000/status/complete"
			}).then(function(){
				currentController.send('refreshModel');
			});
		}

	}
});
