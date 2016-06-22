import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		return Ember.$.getJSON('http://localhost:3000/status/pending/creationDate/1').then(function(response){
			// display the results to the console (for debugging purposes)
			// console.log(JSON.stringify(response));
			return response;
		});
	},

	actions: {
		reloadModel: function() {
			this.refresh();
		}
	}
});
