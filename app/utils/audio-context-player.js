import Ember from 'ember';

export default Ember.Object.extend(Ember.Evented,{
  context  : null,
  source: null,
  audio: null,
  init() {

  },
  loadUrl(url) {
    if(this.get('audio')) {
      this.pause();
      this.set('audio',null);
    }
    var audio = this.createAudio(url),
        context = new AudioContext();
    this.set('audio',audio);
    audio.addEventListener('canplay',() => {
      var source = context.createMediaElementSource(audio);
      source.connect(context.destination);
      this.set('source',source);
    });
  },
  createAudio(url) {
    var audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.src = url;
    audio.autoplay = true;
    audio.addEventListener('ended',() => {
      this.trigger('ended');
    });
    return audio;
  },
  //Things to implement to work with player service
  currentTime() {
    if(this.get('audio')) {
      return this.get('audio').currentTime;
    }
    return 0;
  },
  setSrc(url) {
    this.loadUrl(url);
  },
  play() {
    this.get('audio').play();
  },
  pause() {
    this.get('audio').pause();
  },
  stop() {
    this.pause();
    this.seek(0);
  },
  seek(seek) {
    this.get('audio').currentTime = seek;
  },
  bufferedTime() {
    return this.get('audio').buffered.end(0);
  },
  setAutoPlay(ap) {
  }
});
