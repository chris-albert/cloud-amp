import Ember from 'ember';
import textFormatters from '../utils/text-formatters';
import HtmlPlayer from '../utils/html-player';
import AudioContextPlayer from '../utils/audio-context-player';
import FakePlayer from '../utils/fake-player';

export default Ember.Service.extend({
  playlist    : Ember.inject.service('playlist'),
  audio       : null,
  playing     : false,
  paused      : false,
  stopped     : false,
  currentTime : 0,
  timeInterval: null,
  init() {
    //this.set('audio', AudioContextPlayer.create());
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
      this.get('audio').seek(0);
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
