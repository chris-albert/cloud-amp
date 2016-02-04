import Ember from 'ember';

export default Ember.Object.extend({
  autoplay   : false,
  src        : null,
  currentTime: 0,
  play() {
    console.debug('Fake player play [' + this.get('src') + ']');
  },
  pause() {
    console.debug('Fake player pause');
  },
  fastSeek(seekTo) {
    console.debug('Fake player fastSeek [' + seekTo + ']');
  }
});
