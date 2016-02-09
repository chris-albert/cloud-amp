import Ember from 'ember';
import _ from 'lodash';
import textFormatters from '../utils/text-formatters';
import processor from '../utils/audio-processing';

function trackChanged(f) {
  return Ember.computed('playlist.tracks','playlist.currentPosition',f);
}

export default Ember.Component.extend({
  classNames: ['media-player'],
  player: Ember.inject.service('player'),
  playlist: Ember.inject.service('playlist'),
  cachedProgressBarEl: null,
  actions: {
    play() {
      this.get('player').play();
    },
    pause() {
      this.get('player').pause();
    },
    stop() {
      this.get('player').stop();
    },
    prev() {
      this.get('player').stop();
      this.get('playlist').prev();
      this.get('player').sourceChanged();
    },
    next() {
      this.get('player').stop();
      this.get('playlist').next();
      this.get('player').sourceChanged();
    }
  },
  init: function() {
    this.get('player').on('playing',() => {
      this.setupEq();
    });
    this._super();
  },
  //Using jquery here to update the progress bar since ember.js
  //gets really mad at you if you change inline styles
  percentComplete: Ember.computed('player.currentTime',function() {
    var pb = this.get('cachedProgressBarEl'),
        t = this.get('playlist').getCurrentTrackInfo();
    if(!pb) {
      pb = this.$('.progress-played');
      this.set('cachedProgressBarEl',pb);
    }
    if(t && pb) {
      pb.css('width',((this.get('player.currentTime') / t.duration) * 100) + '%');
    }
    return null;
  }),
  bitRate: "320",
  sampleRate: "44",
  channels: "STEREO",
  setupEq() {
    var ctx = _.head(this.$('.eq-canvas'));
    if(this.get('player.audio.context') && this.get('player.audio.source') && ctx) {
      var p = processor.spectrumAnalyser(this.get('player.audio.context'), this.get('player.audio.source'), ctx);
      this.set('processor',p);
    }
    return null;
  },
  statusIcon: Ember.computed('player.status',function() {
    switch(this.get('player.status')) {
      case 'playing':
        return 'play';
      case 'stopped':
        return 'stop';
      case 'paused':
        return 'pause';
    }
  }),
  bufferedAhead: Ember.computed('player.bufferedTime',function() {
    var pb = this.get('cachedProgressBarBufferedEl'),
      t = this.get('playlist').getCurrentTrackInfo();
    if(!pb) {
      pb = this.$('.progress-buffered');
      this.set('cachedProgressBarBufferedEl',pb);
    }
    if(t && pb) {
      pb.css('width',(((this.get('player.bufferedTime') - this.get('player.currentTime')) / t.duration) * 100) + '%');
    }
    return null;
  }),
  time: Ember.computed('player.currentTime',function() {
     return textFormatters.duration(this.get('player.currentTime'));
  }),
  trackTitle: trackChanged(function() {
    var t = this.get('playlist').getCurrentTrackInfo();
    if(t) {
      return t.artist.name + ' - ' + t.name + ' (' + textFormatters.duration(t.duration) + ')';
    } else {
      return '';
    }
  })
});