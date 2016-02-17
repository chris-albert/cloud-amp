import Ember from 'ember';
import _ from 'lodash';
import config from 'cloud-amp/config/environment';

export default Ember.Component.extend({
  classNames    : ['media-browser'],
  //Column mappings from configs
  artistColumns : config.columns.artist,
  albumColumns  : config.columns.album,
  trackColumns  : config.columns.track,
  //Services
  playlist      : Ember.inject.service('playlist'),
  player        : Ember.inject.service('player'),
  //Component variables
  artistSelected: null,
  albumSelected : null,
  actions       : {
    artistClicked(artist) {
      this.set('artistSelected', artist);
    },
    albumClicked(album) {
      this.set('albumSelected', album);
    },
    trackClicked() {
      //Not quite sure what to do yet when track is clicked
    },
    artistDoubleClicked(artist) {
      this.changePlaylist(_.flatten(_.map(artist.albums, albums => {
        return albums.tracks;
      })));
    },
    albumDoubleClicked(album) {
      this.changePlaylist(album.tracks);
    },
    trackDoubleClicked(track) {
      this.changePlaylist([track]);
    }
  },
  changePlaylist(tracks) {
    var playlist = this.get('playlist');
    playlist.clear();
    _.map(tracks, track => playlist.addTrack(track));
    this.get('player').sourceChanged();
  },
  artists       : Ember.computed.func('model.artists', function (artists) {
    return artists.concat(this.buildAll(artists, 'artists', 'albums'));
  }),
  albums        : Ember.computed.func('model.artists', 'artistSelected', function (artists, selected) {
    var artist = selected;
    if (artist) {
      return artist.albums.concat(this.buildAll(artist.albums, 'albums', 'tracks'));
    }
  }),
  tracks        : Ember.computed.func('model.artists', 'artistSelected', 'albumSelected',
    function (artists, artistSelected, albumSelected) {
      if (artistSelected && albumSelected) {
        var album = albumSelected;
        if (album) {
          return album.tracks;
        }
      }
    }),
  buildAll(things, nameName, nestKey) {
    var all      = {
      name       : 'All (' + things.length + ' ' + nameName + ')',
      albumsCount: _.reduce(things, (sum, thing) => sum + thing.albumsCount, 0),
      tracksCount: _.reduce(things, (sum, thing) => sum + thing.tracksCount, 0),
      played     : _.reduce(things, (sum, thing) => sum + thing.played, 0),
      duration   : _.reduce(things, (sum, thing) => sum + thing.duration, 0)
    };
    all[nestKey] = _.flatten(_.map(things, t => t[nestKey]));
    return all;
  }
});
