import Ember from 'ember';
import _ from 'lodash';
import textFormatters from '../utils/text-formatters';

export default Ember.Component.extend({
  classNames: ['playlist-details'],
  playlist  : Ember.inject.service('playlist'),
  player    : Ember.inject.service('player'),
  items: Ember.computed('playlist.tracks','playlist.currentPosition',function() {
    var current = this.get('playlist.currentPosition');
    return _.map(this.get('playlist.tracks'),(track,i) => {
      var c = '';
      if(i === current) {
        c = 'playing';
      }
      return {
        class : c,
        id    : i,
        values: [
          track.artist.name + ' - ' + track.name,
          textFormatters.duration(track.duration)
        ]
      };
    });
  }),
  actions: {
    selected(id) {
      this.get('playlist').changeToPosition(id);
      this.get('player').sourceChanged();
    }
  }
});
