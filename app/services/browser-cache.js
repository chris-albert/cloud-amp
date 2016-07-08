import Ember from 'ember';

export default Ember.Service.extend({
  setCache(key,value) {
    localStorage.setItem(key,value);
  },
  setJsonCache(key,value) {
    localStorage.setItem(key,JSON.stringify(value));
  },
  getCache(key) {
    return localStorage.getItem(key);
  },
  getJsonCache(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  deleteKey(key) {
    localStorage.removeItem(key);
  }
});
