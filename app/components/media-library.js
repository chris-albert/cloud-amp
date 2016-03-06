import Ember from 'ember';
import _ from 'lodash';

export default Ember.Component.extend({
  classNames: ['media-library','row'],
  libraryView: 'online',
  onlineSelected: Ember.computed.func('libraryView',function(type) {
    return type === 'online';
  }),
  historySelected: Ember.computed.func('libraryView',function(type) {
    return type === 'history';
  }),
  actions: {
    libraryViewChanged(d) {
      this.set('libraryView',d);
    }
  }
});
