import Ember from 'ember';
import config from 'cloud-amp/config/environment';
import _ from 'lodash';

export default Ember.Service.extend({
  tracks: null,
  currentPosition: 0,
  trackChanged: false,
  google: Ember.inject.service('google-play-resource'),
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
    _.map(this.get('tracks'),track => Ember.set(track,'class',null));
    Ember.set(track,'class','playing');
  },
  clear() {
    this.set('tracks',[]);
    this.set('currentPosition',0);
  },
  /**
   * Advances the playlist to the next item in list
   */
  next() {
    this.setPosition(this.get('currentPosition') + 1);
  },
  prev() {
    this.setPosition(this.get('currentPosition') - 1);
  },
  setPosition(i) {
    var tracks = this.get('tracks');
    //As long as we are trying to set to a position that exists in our playlist
    if(i < tracks.length) {

      this.set('currentPosition', i);
    } else {
      console.error('Trying to set to position that is larger that playlist');
    }
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
    if(config.incrementPlayCount) {
      var currTrack = this.getCurrentTrackInfo();
      this.get('google').playCount(currTrack.id)
        .then(isSuccess => {
          console.log('yeay: ' + isSuccess);
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
   * @returns {*}
   */
  getStreamUrl(track) {
    if(track.stream) {
      return new Ember.RSVP.Promise(r => r(track));
    } else {
      return this.get('google').getStreamUrl(track.id)
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
  }
});
