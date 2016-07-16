import Ember from 'ember';
import _ from 'lodash';
import config from 'cloud-amp/config/environment';

export default Ember.Component.extend(Ember.Evented, {
  classNames    : ['media-browser', 'row'],
  //Column mappings from configs
  artistColumns : config.columns.artist,
  albumColumns  : config.columns.album,
  trackColumns  : config.columns.track,
  //Services
  playlist      : Ember.inject.service('playlist'),
  player        : Ember.inject.service('player'),
  library       : Ember.inject.service('library'),
  //Component variables
  artistSelected: null,
  albumSelected : null,
  libraryLoading: false,
  ld            : {
    artists: []
  },
  init() {
    this.get('library');
    return this._super();
  },
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
    },
    clearSearch() {
      this.$('.search-box').val('');
    },
    search(t) {
      //console.log(t);
      //this.get('library').search(t);
    }
  },
  didInsertElement() {
    //var self = this,
    //  searchBox = this.$('.search-box');
    //searchBox.autocomplete({
    //  source(req,res) {
    //    self.get('library').search(req.term)
    //      .then(data => {
    //        res(data);
    //      });
    //  }
    //});
  },
  changePlaylist(tracks) {
    var playlist = this.get('playlist');
    playlist.clear();
    _.map(tracks, track => playlist.addTrack(track));
    this.get('player').sourceChanged();
  },
  didRender() {
    this._super(...arguments);
    this.setLoading(false);
  },
  setLoading(loading) {
    var el = this.$('.media-loading');
    if (el) {
      if (loading) {
        el.show();
      } else {
        el.hide();
      }
    }
  },
  libraryWatcher: Ember.on('init',Ember.observer('library.library', function () {
    var lib = this.get('library.library');
    Ember.run(() => {
      this.setLoading(true);
    });
    Ember.run.next(() => {
      this.set('ld', lib);
      if (lib && lib.artists) {
        var allArtists = this.buildAll(lib.artists, 'artists', 'albums');
        this.set('artistSelected', allArtists);
        this.set('albumSelected', this.buildAll(allArtists.albums, 'albums', 'tracks'));
      } else {
        this.set('ld', {});
        this.set('ld.artists', []);
        this.set('artistSelected', this.buildAll([], 'artists', 'albums'));
        this.set('albumSelected', []);
      }
    });
  })),
  artists       : Ember.computed.func('ld.artists', function (artists) {
    if (artists) {
      return artists.concat(this.buildAll(artists, 'artists', 'albums'));
    }
  }),
  albums        : Ember.computed.func('ld.artists', 'artistSelected', function (artists, selected) {
    var artist = selected;
    if (artist) {
      var all = this.buildAll(artist.albums, 'albums', 'tracks');
      this.set('albumSelected',all);
      return artist.albums.concat(all);
    }
  }),
  tracks        : Ember.computed.func('ld.artists', 'artistSelected', 'albumSelected',
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
