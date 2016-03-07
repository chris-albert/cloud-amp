import Ember from 'ember';
import _ from 'lodash';

export default Ember.Component.extend({
  classNames: ['settings-page','col-md-10','row'],
  googleLoggedIn: false,
  google: Ember.inject.service('google-play-resource'),
  actions: {
    googleLogin() {
      this.set('googleError','');
      this.get('google').login(this.get('email'),this.get('password'))
        .then(r => {
          if(r.token) {
            this.set('googleLoggedIn', true);
          } else {
            this.set('googleError','There was an error logging in');
          }
        });
    },
    googleLogout() {
      this.get('google').logout();
      this.set('googleLoggedIn',false);
    }
  },
  init() {
    this.set('googleLoggedIn',this.get('google').hasToken());
    this._super();
  }
});
