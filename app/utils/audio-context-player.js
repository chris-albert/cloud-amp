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
        context = this.get('context');
    if(!context) {
      context = new AudioContext();
      this.set('context',context);
    }
    this.set('audio',audio);
    audio.addEventListener('canplay',() => {
      var source = context.createMediaElementSource(audio);
      source.connect(context.destination);
      this.set('source',source);
      this.trigger('canplay');
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
    audio.addEventListener('error',() => {
      this.trigger('error');
    });
    return audio;
  },
  currentTime() {
    if(this.get('audio')) {
      return this.get('audio').currentTime;
    }
    return 0;
  },
  toggleMute() {
    var was = this.get('audio').muted;
    this.get('audio').muted = !was;
    return !was;
  },
  changeVolume(volume) {
    this.get('audio').volume = volume / 100;
  },
  sampleRate() {
    return this.get('context').sampleRate;
  },
  channels() {
    return this.get('source').channels;
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
    var audio = this.get('audio');
    if(audio && audio.buffered && audio.buffered.length) {
      return audio.buffered.end(0);
    }
    return 0;
  },
  setAutoPlay(ap) {
  }
});
