import Ember from 'ember';
import _ from 'lodash';
import config from 'cloud-amp/config/environment';

export default Ember.Component.extend({
  library: Ember.inject.service('library'),
  spotifyEnabled: config.spotify.enabled,
  actions: {
    onlineClick(source) {
      this.setLibrary(source);
      this.sendAction('libraryViewChanged','online');
      this.setSelected(source);
    },
    onlineServicesClick() {
      var open = this.$('.online-services.open');
      var closed = this.$('.online-services.closed');
      if (open.length !== 0) {
        open.removeClass('open');
        open.addClass('closed');
        open.find('.glyphicon').removeClass('glyphicon-triangle-bottom');
        open.find('.glyphicon').addClass('glyphicon-triangle-right');
        this.$('.selector-service').hide();
      }
      if(closed.length !== 0) {
        closed.removeClass('closed');
        closed.addClass('open');
        closed.find('.glyphicon').removeClass('glyphicon-triangle-right');
        closed.find('.glyphicon').addClass('glyphicon-triangle-bottom');
        this.$('.selector-service').show();
      }
      this.setSelected('online-services');
    },
    historyClicked() {
      this.sendAction('libraryViewChanged','history');
      this.setSelected('history');
    },
    settingsClicked() {
      this.sendAction('libraryViewChanged','settings');
      this.setSelected('settings');
    }
  },
  setSelected(source) {
    this.$('.selector-item').removeClass('selected');
    this.$('.selector-item.' + source).addClass('selected');
  },
  setLibrary(source) {
    this.get('library').loadLibrary(source);
  },
  init() {
    this._super();
  },
  didInsertElement() {
    this.setLibrary('cloudamp');
    this.setSelected('cloudamp');
  }
});
