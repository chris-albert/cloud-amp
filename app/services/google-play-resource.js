import Ember from 'ember';

export default Ember.Service.extend({
  token  : null,
  baseUrl: 'http://localhost:3000',
  storage: Ember.inject.service('browser-cache'),
  init() {
  },
  getToken(user, pass) {
    var token = this.get('storage').getCache('google-token');
    if (token) {
      return new Ember.RSVP.Promise(r => {
        this.set('token',token);
        r();
      });
    } else {
      return Ember.$.getJSON('http://localhost:3000/token', {
        user: user, pass: pass
      }).then(t => {
        this.get('storage').setCache('google-token',t.token);
        this.set('token', t.token);
      });
    }
  },
  getLibrary() {
    return Ember.$.getJSON(this.get('baseUrl') + '/library',
      {token: this.get('token')});
  },
  getStreamUrl(id) {
    return Ember.$.getJSON(this.get('baseUrl') + '/stream/url/' + id,
      {token: this.get('token')});
  }
});
