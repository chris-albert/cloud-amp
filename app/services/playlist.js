import Ember from 'ember';

export default Ember.Service.extend({
  tracks: null,
  currentPosition: 0,
  trackChanged: false,
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
  /**
   * Advances the playlist to the next item in list
   */
  next() {
    this.setPosition(this.get('currentPosition') + 1);
  },
  setPosition(i) {
    //As long as we are trying to set to a position that exists in our playlist
    if(i < this.get('tracks').length) {
      this.set('currentPosition', i);
    } else {
      console.error('Trying to set to position that is larger that playlist');
    }
  },
  changeToPosition(i) {
    this.setPosition(i);
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
      return Ember.$.getJSON('http://localhost:3000/streamUrl/' + track.id)
        .then(data => {
          track.stream = data;
          return track;
        });
    }
  }
});