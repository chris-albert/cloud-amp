import Ember from 'ember';
import _ from 'lodash';
import textFormatters from '../utils/text-formatters';

export default Ember.Component.extend({
  classNames: ['playlist-details'],
  playlist  : Ember.inject.service('playlist'),
  player    : Ember.inject.service('player'),
  showHeaders: true,
  columns: [
    {name: 'name'},
    {name: 'duration',format: 'duration'}
  ],
  actions: {
    selected(track) {
      this.get('playlist').changeToTrack(track);
      this.get('player').sourceChanged();
    }
  }
});
