import Ember from 'ember';
import config from 'cloud-amp/config/environment';
import _ from 'lodash';

export default Ember.Service.extend({
  tracks: null,
  currentPosition: 0,
  trackChanged: false,
  repeat: false,
  random: false,
  library: Ember.inject.service('library'),
  init() {
    this.set('tracks',[]);
  },
  addTrack(track) {
    this.get('tracks').push(track);
    this.notifyPropertyChange('tracks');
  },
  getCurrentTrackInfo() {
    return this.get('tracks')[this.get('currentPosition')];
  },
  getCurrentTrack() {
    var track = this.get('tracks')[this.get('currentPosition')];
    if(track) {
      return this.getStreamUrl(track);
    }
    return new Ember.RSVP.Promise((r,e) => e(new Error('No track found')));
  },
  setCurrentPlaying() {
    var track = this.getCurrentTrackInfo();
    _.map(this.get('tracks'),track => Ember.set(track,'playing',false));
    Ember.set(track,'playing',true);
  },
  clear() {
    this.set('tracks',[]);
    this.set('currentPosition',0);
  },
  /**
   * Advances the playlist to the next item in list
   */
  next() {
    return this.setPosition(this.getNextPosition());
  },
  prev() {
    return this.setPosition(this.get('currentPosition') - 1);
  },
  getNextPosition() {
    var cp = this.get('currentPosition');
    if(this.get('random')) {
      var np;
      do {
        np = this.getRandomIntInclusive(0,this.getLength());
      } while(np === cp);
      return np;
    }
    return this.get('currentPosition') + 1;
  },
  getLength() {
    var tracks = this.get('tracks');
    if(tracks) {
      return tracks.length;
    }
    return 0;
  },
  setPosition(i) {
    var tracks = this.get('tracks'),
        repeat = this.get('repeat');
    if(i < tracks.length) {
      //If we are not at the end of the playlist
      this.set('currentPosition', i);
      return true;
    } else if(repeat) {
      //If we are at the end of the playlist but we are repeat
      this.get('currentPosition',0);
      return true;
    } else {
      console.error('Trying to set to position that is larger that playlist');
    }
    return false;
  },
  changeToPosition(i) {
    this.setPosition(i);
  },
  changeToTrack(track) {
    var i = null;
    _.map(this.get('tracks'),(t,c) => {
      if(t === track) {
        i = c;
      }
    });
    if(i) {
      this.changeToPosition(i);
    }
  },
  incrementPlayCount() {
    if(config.incrementPlayCount || true) {
      var currTrack = this.getCurrentTrackInfo();
      this.get('library').incrementPlayCount(currTrack.source,currTrack.id)
        .then(isSuccess => {
          Ember.set(currTrack,'played',currTrack.played + 1);
        });
    }
  },
  /**
   * Gets the stream url from the server
   *
   * The first time we get the stream url for a track we will cache it on the
   * tracks `stream` parameter. Then next time we can just get it from the
   * cached param.
   * @param track Track to
   */
  getStreamUrl(track) {
    if(track.stream) {
      return new Ember.RSVP.Promise(r => r(track));
    } else {
      return this.get('library').getStreamUrl(track.source,track.id)
        .then(data => {
          this.notifyPropertyChange('tracks');
          track.stream = data;
          return track;
        });
    }
  },
  unsetCurrentStreamUrl() {
    this.get('tracks')[this.get('currentPosition')].stream = null;
  },
  cacheNextStreamUrl() {
    if(this.get('currentPosition') + 1 < this.get('tracks').length) {
      this.getStreamUrl(this.get('tracks')[this.get('currentPosition') + 1]);
    }
  },
  getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
});
