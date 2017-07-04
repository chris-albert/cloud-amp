import Ember from 'ember';
import config from 'cloud-amp/config/environment';

export default Ember.Service.extend({
  baseUrl: config.apiUrl,
  storage: Ember.inject.service('browser-cache'),
  init() {
  },
  logout() {
    this.get('storage').deleteKey('tidal-token');
  },
  getToken() {
    return this.get('storage').getCache('tidal-token');
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
      return Ember.$.getJSON(this.get('baseUrl') + '/token?source=tidal', {
        username: user, password: pass
      }).then(t => {
        if(t.token) {
          this.get('storage').setCache('tidal-token', t.token);
          this.get('storage').setCache('tidal-user-id', t.userId);
          return t;
        }
        return {};
      });
    }
  },
  clearCache() {
    return this.request('/library/clear');
  },
  request(path) {
    return Ember.$.getJSON(this.get('baseUrl') + path,
      {token: this.getToken()});
  },
  getLibrary() {
    return this.request('/library?source=tidal');
  },
  getStreamUrl(id) {
    return this.request('/stream/url/' + id + '?source=tidal')
      .then(d => {
        d.url = this.get('baseUrl') + '/stream/data?source=tidal&url= ' + encodeURIComponent(d.url);
        return d;
      });
  },
  playCount(id) {
    return this.request('/count/' + id + '?source=tidal')
      .then(d => {
        return d.status === 'ok';
      });
  }
});
