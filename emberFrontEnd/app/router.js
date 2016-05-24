import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('tasks', { path: '/tasks' });
  this.route('taskscomplete', { path: '/tasks/complete' });
});

export default Router;
