import Ember from 'ember';

export default Ember.Object.extend({
  context  : null,
  node: null,
  init() {
    var context = new AudioContext(),
        node = context.createBufferSource();
    this.set('context', context);
    this.set('node',node);
    node.connect(context.destination);
  },
  loadUrl(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // When loaded decode the data
    request.onload = function() {

      // decode the data
      context.decodeAudioData(request.response, function(buffer) {
        // when the audio is decoded play the sound
        playSound(buffer);
      }, onError);
    }
    request.send();
  },
  playSound(buffer) {
    var node = this.get('node');
    node.buffer = buffer;
    node.start(0);
  },
  currentTime() {
  },
  setSrc(url) {
    this.loadUrl(url);
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
