import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Route.extend({
	model: function() {
		return Ember.$.getJSON(ENV.backEndBaseUrl + 'status/pending/creationDate/1').then(function(response){
			return response;
		});
	},

	actions: {
		reloadModel: function() {
			this.refresh();
		}
	}
});
