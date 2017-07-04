import Ember from 'ember';
import config from 'cloud-amp/config/environment';

export default Ember.Service.extend({
  baseUrl: config.apiUrl,
  storage: Ember.inject.service('browser-cache'),
  init() {
    this.get('storage').setCache('cloudamp-token','it doesn\'t really matter.... anymore');
    this._super();
  },
  logout(source) {
    this.get('storage').deleteKey(source + '-token');
  },
  getToken(source) {
    return this.get('storage').getCache(source + '-token');
  },
  hasToken(source) {
    return !!this.getToken(source);
  },
  login(source, user, pass) {
    var token = this.getToken(source);
    if (token) {
      return new Ember.RSVP.Promise(r => {
        r(token);
      });
    } else {
      return Ember.$.getJSON(this.get('baseUrl') + '/token', {
        user  : user,
        pass  : pass,
        source: source
      }).then(t => {
        if (t.token) {
          this.get('storage').setCache('google-token', t.token);
          return t.token;
        }
      });
    }
  },
  request(path, source) {
    var params = {
      token: encodeURIComponent(this.getToken(source)),
      source: source
    };
    // This is bad since this service is supposed to be generic
    if(source === 'tidal') {
      params.userId = this.get('storage').getCache('tidal-user-id');
    }
    return Ember.$.getJSON(this.get('baseUrl') + path, params);
  },
  getLibrary(source) {
    return this.request('/library', source);
  },
  getStreamUrl(source, id) {
    return this.request('/stream/url/' + id, source)
      .then(d => {
        d.url = this.get('baseUrl') + '/stream/data?source=' + source + '&url=' + encodeURIComponent(d.url);
        return d;
      });
  },
  search(query) {
    return this.request('/search?query=' + query,'google');
  },
  incrementPlayCount(source, id) {
    return this.request('/count/' + id, source)
      .then(d => {
        return d.status === 'ok';
      });
  }
});
