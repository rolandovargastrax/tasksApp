import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Route.extend({
	model: function() {
		var results = {};
		return Ember.$.getJSON(ENV.backEndBaseUrl + 'status/complete/completeDate/-1').then(function(response){
			results.completeTasks = response;
			return Ember.$.getJSON(ENV.backEndBaseUrl + 'status/cancelled/completeDate/-1').then(function(response){
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
