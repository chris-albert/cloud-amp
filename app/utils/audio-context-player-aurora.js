import Ember from 'ember';
import AV    from 'npm:av';
import mp3   from 'npm:mp3';
import flac  from 'npm:flac.js';
import _     from 'lodash';

export default Ember.Object.extend(Ember.Evented,{
  context  : null,
  source: null,
  audio: null,
  volume: 100,
  muted: false,
  autoPlay: false,
  init() {

  },
  loadUrl(url) {
    if(this.get('audio')) {
      this.pause();
      this.set('audio',null);
    }
    var audio = this.createAuroraAudio(url),
        context = this.get('context');
    //if(!context) {
    //  context = new AudioContext();
    //  this.set('context',context);
    //}
    //this.set('audio',audio);
    //var firstCanPlay = true;
    //audio.addEventListener('canplay',() => {
    //  if(firstCanPlay) {
    //    var source = context.createMediaElementSource(audio);
    //    source.connect(context.destination);
    //    this.set('source', source);
    //    this.trigger('canplay');
    //    firstCanPlay = false;
    //  }
    //});
  },
  createAuroraAudio(url) {
    var player = AV.Asset.fromURL(url);

    //player.play();
    console.log(AV.Demuxer.formats);
    player.get('format',console.log);
    console.log('Should be playing');
    this.allEvents(player);
    //var asset = AV.Asset.fromURL(url);
    //asset.get('duration', function(duration) {
    //  console.log('Duration: ' + duration);
    //});
    //asset.get('format', function(format) {
    //  console.log('Format: ' + format);
    //});
    //asset.get('metadata', function(buffer) {
    //  console.log('Metadata: ' + buffer);
    //});
    //asset.get('error', function(errro) {
    //  console.log('Error: ' + errro);
    //});
    //console.log('loaded aurora');
    //console.log(asset.metadata);
  },
  allEvents(player) {
    var events = ['metadata','ready','format','error','end'];
    _.map(events,event => {
      player.on(event,d => {
        console.log(event);
        console.log(d);
      });
    });
  },
  createAudio(url) {
    var audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.src = url;
    audio.autoplay = this.get('autoPlay');
    audio.preload = 'auto';
    audio.volume = this.get('volume') / 100;
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
    this.set('autoPlay', ap);
  }
});
