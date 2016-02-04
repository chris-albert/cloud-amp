import Ember from 'ember';
import textFormatters from '../utils/text-formatters';

var FakePlayer = Ember.Object.extend({
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

var HtmlPlayer = Ember.Object.extend({
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
  fastSeek(seekTo) {
    //this.get('audio').fastSeek(seekTo);
  },
  setAutoPlay(ap) {
    this.get('audio').autoplay = ap;
  },
  on(event, fn) {
    this.get('audio').addEventListener(event, fn);
  }
});

export default Ember.Service.extend({
  playlist    : Ember.inject.service('playlist'),
  audio       : null,
  playing     : false,
  paused      : false,
  stopped     : false,
  currentTime : 0,
  timeInterval: null,
  init() {
    this.set('audio', HtmlPlayer.create());
    //this.set('audio',FakePlayer.create());
    this.get('audio').on('ended', () => {
      this.audioEnded();
    });
  },
  audioEnded() {
    this.get('playlist').next();
    this.sourceChanged();
  },
  sourceChanged() {
    this.setProperties({
      playing: false,
      paused : false,
      stopped: false
    });
    this.play();
  },
  play() {
    this.startUpdater();
    if (this.get('paused')) {
      //This means we came from being paused, so just resume
      this.set('paused', false);
      this.get('audio').play();
    } else if (this.get('stopped')) {
      //This means we came from being stopped, so set seek to 0 and play
      this.set('stopped', false);
      this.get('audio').fastSeek(0);
      this.get('audio').play();
    } else {
      //This means we are coming in fresh, so load playback url and start streaming
      this.get('playlist').getCurrentTrack()
        .then(t => {
          var audio = this.get('audio');
          audio.setAutoPlay(true);
          audio.setSrc(t.stream.url);
          this.set('playing', true);
        });
    }
  },
  pause() {
    this.stopUpdater();
    this.set('paused', true);
    this.get('audio').pause();
  },
  stop() {
    this.stopUpdater();
    this.set('stopped', true);
    this.get('audio').pause();
  },
  startUpdater() {
    this.timeInterval = setInterval(() => {
      this.set('currentTime', this.get('audio').currentTime() * 1000);
    }, 500);
  },
  stopUpdater() {
    clearInterval(this.timeInterval);
  }
});
