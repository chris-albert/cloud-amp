import Ember from 'ember';
import _ from 'lodash';
import textFormatters from '../utils/text-formatters';

export default Ember.Component.extend({
  classNames: ['playlist-details'],
  playlist      : Ember.inject.service('playlist'),
  items: Ember.computed('playlist.tracks',function() {
    var current = this.get('playlist.currentPosition');
    return _.map(this.get('playlist.tracks'),(track,i) => {
      var c = '';
      if(i === current) {
        c = 'playing';
      }
      return {
        class: c,
        values: [
          track.artist.name + ' - ' + track.name,
          textFormatters.duration(track.duration)
        ]
      };
    });
  })
});
