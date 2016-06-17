
import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		var results = {};
		return Ember.$.getJSON('http://localhost:3000/status/complete/completeDate/-1').then(function(response){
			results.completeTasks = response;
			return Ember.$.getJSON('http://localhost:3000/status/cancelled/completeDate/-1').then(function(response){
				results.cancelledTasks = response;
				return results;
			});
		});
	},

	actions: {
		reloadModel: function() {
			this.refresh();
		}
	}
});
