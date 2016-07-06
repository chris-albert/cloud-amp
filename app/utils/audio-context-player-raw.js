import Ember from 'ember';

export default Ember.Object.extend(Ember.Evented, {
  context: null,
  source : null,
  audio  : null,
  volume : 100,
  muted  : false,
  init() {

  },
  loadUrl(url) {
    console.log('Loading url: ' + url);
    var exampleSocket = new WebSocket(url);
  },
  createAudio(url) {

  },
  currentTime() {
    return 0;
  },
  totalTime() {
    return null;
  },
  toggleMute() {
  },
  changeVolume(volume) {
  },
  sampleRate() {
  },
  channels() {
  },
  setSrc(url) {
    this.loadUrl(url);
  },
  play() {
  },
  pause() {
  },
  stop() {
  },
  seek(seek) {
  },
  bufferedTime() {
  },
  setAutoPlay(ap) {
  }
});
