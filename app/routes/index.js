import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.$.getJSON('http://localhost:3000/library');
  }
});