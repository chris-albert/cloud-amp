import Ember from 'ember';
import config from 'cloud-amp/config/environment';

export default Ember.Service.extend({
  baseUrl: config.apiUrl,
  storage: Ember.inject.service('browser-cache'),
  init() {
  },
  logout() {
    this.get('storage').deleteKey('google-token');
  },
  getToken() {
    return this.get('storage').getCache('google-token');
  },
  hasToken() {
    return !!this.getToken();
  },
  login(user, pass) {
    var token = this.getToken();
    if (token) {
      return new Ember.RSVP.Promise(r => {
        r(token);
      });
    } else {
      return Ember.$.getJSON(this.get('baseUrl') + '/token?source=google', {
        user: user, pass: pass
      }).then(t => {
        if(t.token) {
          this.get('storage').setCache('google-token', t.token);
          return t.token;
        }
      });
    }
  },
  request(path) {
    return Ember.$.getJSON(this.get('baseUrl') + path,
      {token: this.getToken()});
  },
  getLibrary() {
    return this.request('/library?source=google');
  },
  getStreamUrl(id) {
    return this.request('/stream/url/' + id + '?source=google')
      .then(d => {
        d.url = this.get('baseUrl') + '/stream/data?source=google&url= ' + encodeURIComponent(d.url);
        return d;
      });
  },
  playCount(id) {
    return this.request('/count/' + id + '?source=google')
      .then(d => {
        return d.status === 'ok';
      });
  }
});
