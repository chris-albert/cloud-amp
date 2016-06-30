import Ember from 'ember';
import _ from 'lodash';
import config from 'cloud-amp/config/environment';

export default Ember.Component.extend({
  classNames: ['settings-page','col-md-10','row'],
  googleLoggedIn: false,
  spotifyLoggedIn: false,
  google: Ember.inject.service('google-play-resource'),
  spotify: Ember.inject.service('spotify-resource'),
  library: Ember.inject.service('library'),
  spotifyEnabled: config.spotify.enabled,
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
    },
    spotifyLogout() {
      this.get('spotify').logout();
      this.set('spotifyLoggedIn',false);
    },
    googleCacheClear() {
      this.get('library').unCacheLibrary('google');
    }
  },
  init() {
    this.set('googleLoggedIn',this.get('google').hasToken());
    this.set('spotifyLoggedIn',this.get('spotify').hasToken());
    this._super();
  },
  spotifyUrl: Ember.computed.func('spotify',spotify => {
    return spotify.authUrl();
  })
});
