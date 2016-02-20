import Ember from 'ember';

export default Ember.Object.extend(Ember.Evented,{
  context  : null,
  source: null,
  audio: null,
  volume: 1,
  muted: false,
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
    audio.volume = this.get('volume');
    audio.muted = this.get('muted');
    audio.addEventListener('ended',() => {
      this.trigger('ended');
    });
    audio.addEventListener('error',e => {
      if(e.target.error.code === e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED) {
        this.trigger('mediaError');
      } else {
        this.trigger('error',e);
      }
    });
    return audio;
  },
  currentTime() {
    if(this.get('audio')) {
      return this.get('audio').currentTime;
    }
    return 0;
  },
  totalTime() {
    if(this.get('audio')) {
      return this.get('audio').duration;
    }
    return null;
  },
  toggleMute() {
    var was = this.get('audio').muted;
    this.get('audio').muted = !was;
    this.set('muted',!was);
    return !was;
  },
  changeVolume(volume) {
    this.set('volume',volume);
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
