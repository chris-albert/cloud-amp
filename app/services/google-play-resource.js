import Ember from 'ember';

export default Ember.Service.extend({
  token: null,
  baseUrl: 'http://localhost:3000',
  init() {

  },
  getToken(user,pass) {
    return Ember.$.getJSON('http://localhost:3000/token',{
      user: user, pass: pass
    }).then(t => {
      this.set('token',t.token);
    });
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
