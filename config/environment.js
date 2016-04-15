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
    modulePrefix: 'cloud-amp',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
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

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.apiUrl = 'http://api.cloudamp.io';
    ENV.incrementPlayCount = true;
  }

  return ENV;
};
