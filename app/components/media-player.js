import Ember from 'ember';
import _ from 'lodash';
import textFormatters from '../utils/text-formatters';

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
    }
  },
  //Using jquery here to update the progress bar since ember.js
  //gets really mad at you if you change inline styles
  percentComplete: Ember.computed('player.currentTime',function() {
    var pb = this.get('cachedProgressBarEl'),
        t = this.get('playlist').getCurrentTrackInfo();
    if(!pb) {
      pb = this.$('.progress-bar');
      this.set('cachedProgressBarEl',pb);
    }
    if(t && pb) {
      pb.css('width',((this.get('player.currentTime') / t.duration) * 100) + '%');
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