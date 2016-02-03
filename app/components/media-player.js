import Ember from 'ember';
import _ from 'lodash';

export default Ember.Component.extend({
  classNames: ['media-player'],
  player: Ember.inject.service('player'),
  actions: {
    play() {
      this.get('player').play();
    },
    pause() {
      this.get('player').pause();
    },
    stop() {
      this.get('player').stop();
    }
  }
});