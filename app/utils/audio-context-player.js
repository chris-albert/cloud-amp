import Ember from 'ember';

export default Ember.Object.extend({
  context  : null,
  init() {
    var context = new AudioContext();
    this.set('context', context);
  },
  currentTime() {
  },
  setSrc(url) {
  },
  play() {
  },
  pause() {
  },
  seek(seek) {
  },
  setAutoPlay(ap) {
  },
  on(event, fn) {
  }
});
