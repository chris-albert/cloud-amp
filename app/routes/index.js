import Ember from 'ember';

export default Ember.Route.extend({
  google: Ember.inject.service('google-play-resource'),
  model() {
    var user = '';
    var pass = '';
    var google = this.get('google');
    return google.getToken(user,pass)
      .then(() => google.getLibrary());
  }
});
