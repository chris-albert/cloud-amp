import Ember from 'ember';
import _ from 'lodash';

export default Ember.Route.extend({
  model() {
    return {
      artists: []
    };
  },
  /**
   * We would like that each artist and track point to their respective owners,
   * so we can easily climb back up the stack
   */
  wireUpRelations(library) {
    _.forEach(library.artists,artist => {
      _.forEach(artist.albums,album => {
        album.artist = artist;
        _.forEach(album.tracks,track => {
          track.album = album;
          track.artist = artist;
        });
      });
    });
    return library;
  }
});
