import Ember from 'ember';

export default Ember.Service.extend({
  tracks: null,
  currentPosition: 0,
  init() {
    this.set('tracks',[]);
  },
  addTrack(track) {
    this.get('tracks').push(track);
  },
  getCurrentTrack() {
    var track = this.get('tracks')[this.get('currentPosition')];
    if(track) {
      return this.getStreamUrl(track);
    }
    return new Ember.RSVP.Promise((r,e) => e(new Error('No track found')));
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