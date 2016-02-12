import Ember from 'ember';
import _ from 'lodash';
import config from 'cloud-amp/config/environment';
import textFormatters from '../utils/text-formatters';

export default Ember.Component.extend({
  classNames    : ['media-browser'],
  artistColumns : config.columns.artist,
  albumColumns  : config.columns.album,
  trackColumns  : config.columns.track,
  playlist      : Ember.inject.service('playlist'),
  player        : Ember.inject.service('player'),
  formats       : textFormatters,
  actions       : {
    artistClicked(artist) {
      this.set('artistSelected', artist);
    },
    albumClicked(album) {
      this.set('albumSelected', album);
    },
    trackClicked(track) {
      this.get('playlist').addTrack(this.findTrack(track));
    },
    artistDoubleClicked(artist) {
      var playlist = this.get('playlist');
      playlist.clear();
      _.map(this.findArtist(artist).albums, albums => {
        _.map(albums.tracks, track => {
          playlist.addTrack(track);
        });
      });
      this.get('player').sourceChanged();
    },
    albumDoubleClicked(album) {
      var playlist = this.get('playlist');
      playlist.clear();
      _.map(this.findAlbum(album).tracks, track => {
        playlist.addTrack(track);
      });
      this.get('player').sourceChanged();
    },
    trackDoubleClicked(track) {
      var playlist = this.get('playlist');
      playlist.clear();
      playlist.addTrack(this.findTrack(track));
      this.get('player').sourceChanged();
    }
  },
  findArtist(artist) {
    return _.get(this.get('artistHash'), [artist]);
  },
  findAlbum(album) {
    return _.get(this.get('artistHash'), [
      this.get('artistSelected'),
      'albumsHash',
      album
    ]);
  },
  findTrack(track) {
    return _.get(this.get('artistHash'), [
      this.get('artistSelected'),
      'albumsHash',
      this.get('albumSelected'),
      'tracksHash',
      track
    ]);
  },
  artistHeaders : Ember.computed('artistColumns', function () {
    return _.map(this.get('artistColumns'), 'display');
  }),
  albumHeaders  : Ember.computed('albumColumns', function () {
    return _.map(this.get('albumColumns'), 'display');
  }),
  trackHeaders  : Ember.computed('trackColumns', function () {
    return _.map(this.get('trackColumns'), 'display');
  }),
  sorted(data, key) {
    if (data) {
      return data.sort((a, b) => {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
      });
    }
  },
  buildItems(columnsKey, data, sortBy) {
    var columns = this.get(columnsKey);
    return _.map(this.sorted(data, sortBy), artist => {
      var item = _.map(columns, column => {
        var value = _.get(artist, column.name);
        if (!_.isUndefined(value)) {
          var n = value;
          if (column.format && _.isFunction(this.get('formats.' + column.format))) {
            n = this.get('formats.' + column.format)(n);
          }
          return n;
        }
      });

      return {
        id    : artist.name,
        values: item
      };
    });
  },
  artistSelected: null,
  albumSelected : null,
  artistHash    : Ember.computed('model.artists', function () {
    return _.indexBy(_.map(this.get('model.artists'), artist => {
      artist.albumsHash = _.indexBy(artist.albums, 'name');
      _.map(artist.albumsHash, album => {
        album.artist     = artist;
        album.tracksHash = _.indexBy(album.tracks, 'name');
        _.map(album.tracks, track => {
          track.artist = artist;
          track.album  = album;
        });
      });
      return artist;
    }), 'name');
  }),
  artistsKeys       : Ember.computed.func('model.artists', function (artists) {
    return artists;
  }),
  artists       : Ember.computed('model.artists', function () {
    return this.buildItems('artistColumns', this.get('model.artists'), 'name');
  }),
  albums        : Ember.computed('model.artists', 'artistSelected', function () {
    var artist = this.get('artistHash')[this.get('artistSelected')];
    if (artist) {
      return this.buildItems('albumColumns', artist.albums, 'year');
    }
  }),
  tracks        : Ember.computed('model.artists', 'artistSelected', 'albumSelected', function () {
    var artistSelected = this.get('artistSelected'),
        albumSelected  = this.get('albumSelected');
    if (artistSelected && albumSelected) {
      var album = _.get(this.get('artistHash'),
        [artistSelected, 'albumsHash', albumSelected]);
      if (album) {
        return this.buildItems('trackColumns', album.tracks, 'trackNum');
      }
    }
  })
});
