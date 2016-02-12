import Ember from 'ember';
import _ from 'lodash';
import config from 'cloud-amp/config/environment';
import textFormatters from '../utils/text-formatters';

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
      this.set('artistSelected', artist.name);
    },
    albumClicked(album) {
      this.set('albumSelected', album.name);
    },
    trackClicked(track) {
      //Not quite sure what to do yet when track is clicked
    },
    artistDoubleClicked(artist) {
      this.changePlaylist(_.flatten(_.map(this.findArtist(artist.name).albums, albums => {
        return albums.tracks;
      })));
    },
    albumDoubleClicked(album) {
      this.changePlaylist(this.findAlbum(album.name).tracks);
    },
    trackDoubleClicked(track) {
      this.changePlaylist([track]);
    }
  },
  changePlaylist(tracks) {
    var playlist = this.get('playlist');
    playlist.clear();
    _.map(tracks,track => playlist.addTrack(track));
    this.get('player').sourceChanged();
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
  artists       : Ember.computed.func('model.artists', function (artists) {
    return artists;
  }),
  albums        : Ember.computed.func('model.artists', 'artistSelected', function (artists,selected) {
    var artist = this.get('artistHash')[selected];
    if (artist) {
      return artist.albums;
    }
  }),
  tracks        : Ember.computed.func('model.artists', 'artistSelected', 'albumSelected',
    function (artists,artistSelected,albumSelected) {
    if (artistSelected && albumSelected) {
      var album = _.get(this.get('artistHash'),
        [artistSelected, 'albumsHash', albumSelected]);
      if (album) {
        return album.tracks;
      }
    }
  })
});
