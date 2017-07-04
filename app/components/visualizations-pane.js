import Ember from 'ember';
import config from 'cloud-amp/config/environment';
import _ from 'lodash';
import processor from '../utils/audio-processing';

export default Ember.Component.extend({
  classNames: ['visualizations', 'row'],
  player    : Ember.inject.service('player'),
  init() {
    this.setupViz();
    this._super();
  },
  setupViz() {
    var ctx = _.head(this.$('.viz'));
    if (this.get('player.audio.context') && this.get('player.audio.source') && ctx) {
      //if (this.get('processor')) {
      //  this.get('processor').onaudioprocess = function () {
      //  };
      //}
      var p = processor.spectrumAnalyser(this.get('player.audio.context'), this.get('player.audio.source'), ctx);
      this.set('processor', p);
    }
    return null;
  }
});
