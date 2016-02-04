import Ember from 'ember';

export default Ember.Service.extend({
  setCache(key,value) {
    localStorage.setItem(key,value);
  },
  getCache(key) {
    return localStorage.getItem(key);
  }
});
