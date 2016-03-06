import Ember from 'ember';
import config from 'cloud-amp/config/environment';

export default Ember.Service.extend({
  baseUrl: config.apiUrl,
  storage: Ember.inject.service('browser-cache'),
  request(path) {
    return Ember.$.getJSON(this.get('baseUrl') + path);
  },
  getLibrary() {
    return this.request('/s3');
  },
  getStreamUrl(id) {
    console.error('getStreamUrl not implemented');
  },
  playCount(id) {
    console.error('playCount not implemented');
  }});
