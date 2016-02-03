import Ember from 'ember';
import _ from 'lodash';

export default Ember.Component.extend({
  classNames    : ['media-browser'],
  nestSplit     : '==>',
  artistColumns : [
    {
      name   : 'name',
      display: 'Artist'
    },
    {
      name   : 'albumsCount',
      display: 'Albums'
    },
    {
      name   : 'tracksCount',
      display: 'Tracks'
    },
    {
      name   : 'duration',
      display: 'Length',
      format : 'duration'
    }
  ],
  albumColumns  : [
    {
      name   : 'name',
      display: 'Album'
    },
    {
      name   : 'year',
      display: 'Year'
    },
    {
      name   : 'tracksCount',
      display: 'Tracks'
    },
    {
      name   : 'duration',
      display: 'Length',
      format : 'duration'
    }
  ],
  trackColumns  : [
    {
      name   : 'trackNum',
      display: 'Track Number'
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
      name   : 'album.year',
      display: 'Year'
    },
    {
      name   : 'played',
      display: 'Played'
    },
    {
      name   : 'duration',
      display: 'Length',
      format : 'duration'
    }
  ],
  formats       : {
    duration: function (d) {
      function pad(num) {
        if(num < 10) {
          return '0' + num;
        }
        return num;
      }
      var m = moment.duration(d),
          d = pad(m.minutes())+ ':' + pad(m.seconds());
      if(m.hours() >= 1) {
        d = m.hours() + ':' + d;
      }
      return d;
    }
  },
  actions       : {
    artistClicked(artist) {
      this.set('artistSelected', artist);
    },
    albumClicked(album) {
      this.set('albumSelected', album);
    },
    trackClicked(track) {
      console.log(track);
    }
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
    return data.sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
  },
  buildItems(columnsKey, data, sortBy) {
    var columns = this.get(columnsKey);
    return _.map(this.sorted(data, sortBy), artist => {
      var item = _.map(columns, column => {
        var value = _.get(artist, column.name);
        if (value) {
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
        album.artist = artist;
        _.map(album.tracks, track => {
          track.artist = artist;
          track.album  = album;
        });
      });
      return artist;
    }), 'name');
  }),
  artists       : Ember.computed('model.artists', function () {
    return this.buildItems('artistColumns', this.get('model.artists'),'name');
  }),
  albums        : Ember.computed('model.artists', 'artistSelected', function () {
    var artist = this.get('artistHash')[this.get('artistSelected')];
    if (artist) {
      return this.buildItems('albumColumns', artist.albums,'year');
    }
  }),
  tracks        : Ember.computed('model.artists', 'artistSelected', 'albumSelected', function () {
    var artistSelected = this.get('artistSelected'),
        albumSelected  = this.get('albumSelected');
    if (artistSelected && albumSelected) {
      var album = _.get(this.get('artistHash'),
        [artistSelected, 'albumsHash', albumSelected]);
      if (album) {
        return this.buildItems('trackColumns', album.tracks,'trackNum');
      }
    }
  })
});
