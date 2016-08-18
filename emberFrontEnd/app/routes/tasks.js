import Ember from 'ember';
import ENV from '../config/environment';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/route';

export default Ember.Route.extend(KeyboardShortcuts, {
	model: function() {
		try{
			var getCallUrl = ENV.backEndBaseUrl + 'status/pending/creationDate/1';
			return Ember.$.ajax({
				type: "GET",
	      url: getCallUrl,
	      success: function(response) {
	      	return response;
	      },
	      error: function(err) {
	      	var results = {};
	      	results.items = [];
          console.log(err);
	      	return results;
	      }
	    });
		}
		catch(err){
			var results = {};
    	results.items = [];
    	return results;
		}
	},

	actions: {
		reloadModel: function() {
			this.refresh();
		},

		focusOnAddText1: function() {
			document.getElementById("addTaskTextField").focus();

			// no need to call the controller... you may focus from the route
			// var controller = this.controllerFor('tasks');
			// controller.send('focusOnAddText2');
		},

		removeFilterShortcut: function(){
			var controller = this.controllerFor('tasks');
			controller.send('removeFilterProject');
		}
	},

	keyboardShortcuts: {
		// // trigger 'cancel' action when esc is pressed
		// 'esc' : 'cancel',

		'ctrl+a' : {
			action: 'focusOnAddText1', // action to trigger
			global: true,    // whether to trigger inside input (default: true)
			preventDefault: true     // (default: true)
		},

		'ctrl+r' : {
			action: 'removeFilterShortcut', // action to trigger
			global: true,    // whether to trigger inside input (default: true)
			preventDefault: true     // (default: true)
		}

	}
});
