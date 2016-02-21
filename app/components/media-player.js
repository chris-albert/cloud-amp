import Ember from 'ember';
import _ from 'lodash';
import textFormatters from '../utils/text-formatters';
import processor from '../utils/audio-processing';

function trackChanged(f) {
  return Ember.computed('playlist.tracks','playlist.currentPosition',f);
}

export default Ember.Component.extend(Ember.Evented,{
  classNames: ['media-player'],
  player: Ember.inject.service('player'),
  playlist: Ember.inject.service('playlist'),
  cachedProgressBarEl: null,
  muted: false,
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
    },
    mute() {
      this.set('muted', this.get('player').toggleMute());
    },
    repeat() {
      this.toggleProperty('playlist.repeat');
    },
    random() {
      this.toggleProperty('playlist.random');
    }
  },
  init: function() {
    this.get('player').on('playing',() => {
      this.setupEq();
    });
    this.on('volumeChanged',this.volumeChange);
    this.on('progressChanged',this.progressChange);
    this._super();
  },
  didInsertElement() {
    var self = this;
    this.$('.volume-slider')
      .slider({
        range: 'min',
        value: 100,
        slide: function(e,ui) {
          self.trigger('volumeChanged',ui.value);
        }
      });
    this.set('progress-slider-el',this.$('.progress-slider')
      .slider({
        range: 'min',
        value: 0,
        step: .01,
        animate: true,
        slide: function(e,ui) {
          self.trigger('progressChanged',ui.value);
        }
      }));
    this.set('progress-slider-buffered',this.$('.slider-buffered'));
  },
  progressChange(value) {
    this.get('player').seek(value);
  },
  volumeChange(value) {
    this.get('player').changeVolume(value);
  },
  muteIcon: Ember.computed.if('muted','up','off'),
  percentComplete: Ember.computed('player.currentTime',function() {
    var slider = this.get('progress-slider-el'),
             t = this.get('playlist').getCurrentTrackInfo();
    if(slider && t) {
      slider.slider('value', ((this.get('player.currentTime') / t.duration) * 100));
    }
    return null;
  }),
  bufferedAhead: Ember.computed('player.bufferedTime',function() {
    var pb = this.get('progress-slider-buffered'),
         t = this.get('playlist').getCurrentTrackInfo();
    if(t && pb) {
      var time = (this.get('player.bufferedTime') / t.duration) * 100;
      //For some reason this can calculate to more that 100%
      if(time > 100) {
        time = 100;
      }
      pb.css('width',time + '%');
    }
    return null;
  }),
  bitRate: "320",
  sampleRate: "44",
  channels: "STEREO",
  setupEq() {
    var ctx = _.head(this.$('.eq-canvas'));
    if(this.get('player.audio.context') && this.get('player.audio.source') && ctx) {
      if(this.get('processor')) {
        this.get('processor').onaudioprocess = function() {};
      }
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
