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
  almostDoneFired: false,
  init() {
    this.set('audio', AudioContextPlayer.create());
    this.get('audio').on('ended', () => {
      this.audioEnded();
    });
    //In case the stream url gets a 403, try to get it again
    //TODO: Make sure this doesn't happen forever in an infinite loop
    this.get('audio').on('mediaError',e => {
      this.get('playlist').unsetCurrentStreamUrl();
      this.sourceChanged();
    });
  },
  audioEnded() {
    this.get('playlist').incrementPlayCount();
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
      //This means we are coming in fresh or next in playlist, so start streaming
      this.get('playlist').getCurrentTrack()
        .then(t => {
          var audio = this.get('audio');
          audio.setAutoPlay(true);
          audio.setSrc(t.stream.url);
          this.set('almostDoneFired',false);
          audio.on('canplay',() => {
            this.trigger('playing');
          });
        });
    }
    this.set('status','playing');
  },
  changeVolume(volume) {
    this.get('audio').changeVolume(volume);
  },
  toggleMute() {
    return this.get('audio').toggleMute();
  },
  pause() {
    this.stopUpdater();
    this.set('status', 'paused');
    this.get('audio').pause();
    this.trigger('paused');
  },
  stop() {
    this.stopUpdater();
    this.set('status', 'stopped');
    this.get('audio').stop();
    this.trigger('stopped');
  },
  startUpdater() {
    this.timeInterval = setInterval(() => {
      var audio = this.get('audio'),
          ct = this.get('audio').currentTime();
      this.set('currentTime', ct * 1000);
      this.set('bufferedTime',audio.bufferedTime() * 1000);
      if(audio.totalTime() && audio.totalTime() - 20 < ct && !this.get('almostDoneFired')) {
        this.get('playlist').cacheNextStreamUrl();
        this.set('almostDoneFired',true);
      }
    }, 500);
  },
  stopUpdater() {
    clearInterval(this.timeInterval);
  }
});
