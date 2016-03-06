import Ember from 'ember';
import _ from 'lodash';

export default Ember.Component.extend({
  classNames    : ['history-table', 'row', 'col-md-10'],
  historyService: Ember.inject.service('history'),
  columns       : [
    {
      name   : 'lastPlayed',
      display: 'Last Played',
      format : 'date'
    },
    {
      name   : 'played',
      display: 'Play Count'
    },
    {
      name   : 'artist.name',
      display: 'Artist'
    },
    {
      name   : 'album.name',
      display: 'Album'
    },
    {
      name   : 'name',
      display: 'Track'
    },
    {
      name   : 'length',
      display: 'Length',
      format : 'duration'
    }
  ],
  history       : Ember.computed.func('historyService.history', function (history) {
    console.log(history);
    return history;
  })
});
