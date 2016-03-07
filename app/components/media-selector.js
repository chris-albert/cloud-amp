import Ember from 'ember';
import _ from 'lodash';

export default Ember.Component.extend({
  library: Ember.inject.service('library'),
  actions: {
    onlineClick(source) {
      this.setLibrary(source);
      this.sendAction('libraryViewChanged','online');
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
    },
    historyClicked() {
      this.sendAction('libraryViewChanged','history');
    },
    settingsClicked() {
      this.sendAction('libraryViewChanged','settings');
    }
  },
  setSelected(source) {
    this.$('.selector-service').removeClass('selected');
    this.$('.selector-service.' + source).addClass('selected');
  },
  setLibrary(source) {
    this.get('library').loadLibrary(source);
    this.setSelected(source);
  },
  init() {
    this._super();
  },
  didInsertElement() {
    this.setLibrary('cloudamp');
  }
});
