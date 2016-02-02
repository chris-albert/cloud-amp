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
      display: 'Number'
    },
    {
      name   : 'name',
      display: 'Artist'
    },
    {
      name   : 'album',
      display: 'Album'
    },
    {
      name   : 'track',
      display: 'Track'
    },
    {
      name   : 'played',
      display: 'Played'
    },
    {
      name   : 'duration',
      display: 'Length',
      format: 'duration'
    }
  ],
  formats       : {
    duration: function (d) {
      return moment(d).format('mm:ss');
    }
  },
  actions       : {
    artistClicked(artist) {
      this.set('artistSelected', artist);
    },
    albumClicked(album) {
      this.set('albumSelected', album);
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
  buildItems(columnsKey, data) {
    var columns = this.get(columnsKey);
    return _.map(this.sorted(data, 'name'), artist => {
      var item = _.map(columns, column => {
        if (artist[column.name]) {
          var n = artist[column.name];
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
    return _.indexBy(_.map(this.get('model.artists'),artist => {
      artist.albumsHash = _.indexBy(artist.albums,'name');
      return artist;
    }), 'name');
  }),
  artists       : Ember.computed('model.artists', function () {
    return this.buildItems('artistColumns', this.get('model.artists'));
  }),
  albums        : Ember.computed('model.artists', 'artistSelected', function () {
    var artist = this.get('artistHash')[this.get('artistSelected')];
    if (artist) {
      return this.buildItems('albumColumns', artist.albums);
    }
  }),
  tracks        : Ember.computed('model.artists', 'artistSelected','albumSelected', function () {
    var artistSelected = this.get('artistSelected'),
        albumSelected = this.get('albumSelected');
    if(artistSelected && albumSelected) {
      var album = this.recursiveLookup(this.get('artistHash'),
        [artistSelected, 'albumsHash', albumSelected]);
      if (album) {
        return this.buildItems('trackColumns', album.tracks);
      }
    }
  }),
  recursiveLookup(obj,keys) {
    var r = obj;
    _.map(keys,k => {
      if(r[k]) {
        r = r[k];
      }
    });
    return r;
  }
});
