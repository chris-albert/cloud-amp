import Ember from 'ember';
import config from 'cloud-amp/config/environment';

export default Ember.Controller.extend({
  google: Ember.inject.service('google-play-resource'),
  actions: {
    login() {
      this.set('error','');
      this.get('google').login(this.get('email'),this.get('password'))
        .then(r => {
          if(r) {
            this.set('loggedIn', true);
          } else {
            this.set('error','There was an error logging in');
          }
        });
    },
    logout() {
      this.get('google').logout();
      this.set('loggedIn',false);
    }
  },
  init() {
    this.set('loggedIn',this.get('google').hasToken());
    this._super();
  }
});
