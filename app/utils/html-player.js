import Ember from 'ember';

export default Ember.Object.extend({
  autoplay: false,
  src     : null,
  audio  : null,
  init() {
    var audio = new Audio();
    this.set('audio', audio);
    audio.autoplay = true;
  },
  currentTime() {
    return this.get('audio').currentTime;
  },
  setSrc(url) {
    this.get('audio').src = url;
  },
  play() {
    this.get('audio').play();
  },
  pause() {
    this.get('audio').pause();
  },
  seek(seek) {
    this.get('audio').currentTime = seek;
  },
  setAutoPlay(ap) {
    this.get('audio').autoplay = ap;
  },
  on(event, fn) {
    this.get('audio').addEventListener(event, fn);
  }
});
