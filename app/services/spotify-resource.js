import Ember from 'ember';
import config from 'cloud-amp/config/environment';
import _ from 'lodash';

export default Ember.Service.extend({
  baseUrl: config.apiUrl,
  storage: Ember.inject.service('browser-cache'),
  setToken(token) {
    this.get('storage').setCache('spotify-token', token);
  },
  exchangeCode(code) {
    var token = this.getToken();
    if (token) {
      return new Ember.RSVP.Promise(r => {
        r(token);
      });
    } else {
      return Ember.$.getJSON(this.get('baseUrl') + '/token?source=spotify', {
        code: code
      }).then(t => {
        if(t.token) {
          this.get('storage').setCache('spotify-token', t.token);
          return t;
        }
        return {};
      });
    }
  },
  getToken() {
    return this.get('storage').getCache('spotify-token');
  },
  hasToken() {
    return !!this.getToken();
  },
  logout() {
    this.get('storage').deleteKey('spotify-token');
  },
  authUrl() {
    var query = {
      client_id    : config.spotify.clientId,
      response_type: 'code',
      redirect_uri : 'http://localhost:4200/auth/spotify',
      state        : 'cloudamp-change-me-later',
      scope        : 'user-library-read'
    };
    var s = _.map(query,(v,k) => {
      return k + '=' + v;
    }).join('&');
    return config.spotify.authUrl + '?' + s;
  }
});
