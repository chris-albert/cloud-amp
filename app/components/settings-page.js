import Ember from 'ember';
import _ from 'lodash';
import config from 'cloud-amp/config/environment';

export default Ember.Component.extend({
  classNames: ['settings-page','col-md-10','row'],
  googleLoggedIn: false,
  spotifyLoggedIn: false,
  tidalLoggedId: false,
  google: Ember.inject.service('google-play-resource'),
  spotify: Ember.inject.service('spotify-resource'),
  tidal: Ember.inject.service('tidal-resource'),
  library: Ember.inject.service('library'),
  spotifyEnabled: config.spotify.enabled,
  tidalEnabled: config.tidal.enabled,
  actions: {
    googleLogin() {
      this.callLogin('google');
    },
    googleLogout() {
      this.get('google').logout();
      this.set('googleLoggedIn',false);
    },
    spotifyLogout() {
      this.get('spotify').logout();
      this.set('spotifyLoggedIn',false);
    },
    tidalLogin() {
      this.callLogin('tidal');
    },
    tidalLogout() {
      this.get('tidal').logout();
      this.set('tidalLoggedIn',false);
    },
    googleCacheClear() {
      this.get('library').unCacheLibrary('google');
    }
  },
  init() {
    this.set('googleLoggedIn',this.get('google').hasToken());
    this.set('spotifyLoggedIn',this.get('spotify').hasToken());
    this.set('tidalLoggedIn',this.get('tidal').hasToken());
    this._super();
  },
  callLogin(source) {
    this.set(source + 'Error','');
    this.get(source).login(this.get('email'),this.get('password'))
      .then(r => {
        if(r.token) {
          this.set(source + 'LoggedIn', true);
        } else {
          this.set(source + 'Error','There was an error logging in');
        }
      });
  },
  spotifyUrl: Ember.computed.func('spotify',spotify => {
    return spotify.authUrl();
  })
});
