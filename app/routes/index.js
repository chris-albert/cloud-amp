import Ember from 'ember';

export default Ember.Route.extend({
  google: Ember.inject.service('google-play-resource'),
  model() {
    var google = this.get('google');
    if(google.hasToken()) {
      return google.getLibrary();
    }
  }
});
