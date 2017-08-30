/* jshint node: true */

var columns = {
  artist : [
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
      name   : 'played',
      display: 'Played'
    },
    {
      name   : 'duration',
      display: 'Length',
      format : 'duration'
    }
  ],
  album  : [
    {
      name   : 'name',
      display: 'Album'
    },
    {
      name   : 'year',
      display: 'Year'
    },
    {
      name   : 'played',
      display: 'Played'
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
  track  : [
    {
      name   : 'trackNum',
      display: 'Track #'
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
      name   : 'genre',
      display: 'Genre'
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
  ]
};


module.exports = function(environment) {
  var ENV = {
    spotify: {
      authUrl: 'https://accounts.spotify.com/authorize',
      clientId: 'bb0936b2d148469593ae174953e02e98',
      enabled: false
    },
    tidal: {
      enabled: false
    },
    modulePrefix: 'cloud-amp',
    environment: environment,
    baseURL: '/',

    locationType: 'hash',
    EmberENV: {
      FEATURES: {}
    },
    APP: {},
    columns: columns,
    apiUrl: 'http://localhost:3000',
    incrementPlayCount: false,
    contentSecurityPolicy:  {
      'connect-src': "'self' http://localhost:3000",
      'media-src': "'self' http://localhost:3000",
      'img-src': "'self' *",
      'style-src': "'self' 'unsafe-inline'"
    }
  };

  // if (environment === 'production') {
    ENV.apiUrl = 'http://api.cloudamp.io';
    ENV.incrementPlayCount = true;
    ENV.contentSecurityPolicy =  {
      'connect-src': "'self' http://api.cloudamp.io",
        'media-src': "'self' http://api.cloudamp.io",
        'img-src': "'self' *",
        'style-src': "'self' 'unsafe-inline'"
    };
  // }

  return ENV;
};
