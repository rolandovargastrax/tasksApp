// import Ember from 'ember';

// export default Ember.Route.extend({
// 	model: function() {
// 		return Ember.$.getJSON('http://localhost:3000/status/complete').then(function(response){
// 			// display the results to the console (for debugging purposes)
// 			// console.log(JSON.stringify(response));
// 			return response;
// 		});
// 	},

// 	actions: {
// 		reloadModel: function() {
// 			this.refresh();
// 		}
// 	}
// });


import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		var results = {};
		return Ember.$.getJSON('http://localhost:3000/status/complete').then(function(response){
			results.completeTasks = response;
			return Ember.$.getJSON('http://localhost:3000/status/cancelled').then(function(response){
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
