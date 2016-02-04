import Ember from 'ember';
import _ from 'lodash';
import textFormatters from '../utils/text-formatters';

export default Ember.Component.extend({
  classNames: ['now-playing-details'],
  playlist: Ember.inject.service('playlist'),
  track: Ember.computed('playlist.currentPosition','playlist.tracks',function() {
    return this.get('playlist').getCurrentTrackInfo();
  }),
  duration: Ember.computed('playlist.currentPosition','playlist.tracks',function() {
    var t = this.get('playlist').getCurrentTrackInfo();
    console.log(t);
    if(t && t.duration) {
      return textFormatters.duration(t.duration);
    } else {
      return '';
    }
  })
});
