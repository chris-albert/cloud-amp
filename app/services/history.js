import Ember from 'ember';

export default Ember.Service.extend({
  history: null,
  init() {
    this.set('history',[]);
  },
  addHistory(track) {
    track.lastPlayed = new Date();
    this.get('history').push(track);
  }
});
