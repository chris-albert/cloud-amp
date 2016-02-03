import Ember from 'ember';

var FakePlayer = Ember.Object.extend({
  autoplay: false,
  src: null,
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

export default Ember.Service.extend({
  playlist: Ember.inject.service('playlist'),
  audio: null,
  playing: false,
  paused: false,
  stopped: false,
  init() {
    //this.set('audio',new Audio());
    this.set('audio',FakePlayer.create());
    console.log(this.get('audio'));
  },
  play() {
    if(this.get('paused')) {
      //This means we came from being paused, so just resume
      this.set('paused', false);
      this.get('audio').play();
    }else if (this.get('stopped')) {
      //This means we came from being stopped, so set seek to 0 and play
      this.set('stopped',false);
      this.get('audio').fastSeek(0);
      this.get('audio').play();
    } else {
      //This means we are coming in fresh, so load playback url and start streaming
      this.get('playlist').getCurrentTrack()
        .then(t => {
          var audio = this.get('audio');
          audio.autoplay = true;
          audio.src = t.stream.url;
          this.set('playing', true);
        });
    }
  },
  pause() {
    this.set('paused',true);
    this.get('audio').pause();
  },
  stop() {
    this.set('stopped',true);
    this.get('audio').pause();
  }
});