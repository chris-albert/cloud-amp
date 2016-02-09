import Ember from 'ember';
import textFormatters from '../utils/text-formatters';
import HtmlPlayer from '../utils/html-player';
import AudioContextPlayer from '../utils/audio-context-player';
import FakePlayer from '../utils/fake-player';

export default Ember.Service.extend(Ember.Evented,{
  playlist    : Ember.inject.service('playlist'),
  audio       : null,
  status      : null,
  currentTime : 0,
  bufferedTime: 0,
  timeInterval: null,
  init() {
    this.set('audio', AudioContextPlayer.create());
    //this.set('audio', HtmlPlayer.create());
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
    this.set('status',null);
    this.play();
  },
  play() {
    this.startUpdater();
    var status = this.get('status');
    if (status === 'paused') {
      //This means we came from being paused, so just resume
      this.get('audio').play();
    } else if (status === 'stopped') {
      //This means we came from being stopped, so set seek to 0 and play
      this.get('audio').seek(0);
      this.get('audio').play();
    } else {
      //This means we are coming in fresh, so load playback url and start streaming
      this.get('playlist').getCurrentTrack()
        .then(t => {
          var audio = this.get('audio');
          audio.setAutoPlay(true);
          audio.setSrc(t.stream.url);
          audio.on('canplay',() => {
            this.trigger('playing');
          });
        });
    }
    this.set('status','playing');
  },
  pause() {
    this.stopUpdater();
    this.set('status', 'paused');
    this.set('paused', true);
    this.get('audio').pause();
    this.trigger('paused');
  },
  stop() {
    this.stopUpdater();
    this.set('status', 'stopped');
    this.set('stopped', true);
    this.get('audio').stop();
    this.trigger('stopped');
  },
  startUpdater() {
    this.timeInterval = setInterval(() => {
      this.set('currentTime', this.get('audio').currentTime() * 1000);
      this.set('bufferedTime',this.get('audio').bufferedTime() * 1000);
    }, 500);
  },
  stopUpdater() {
    clearInterval(this.timeInterval);
  }
});
