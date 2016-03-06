import Ember from 'ember';
import _ from 'lodash';

export default Ember.Component.extend({
  library       : Ember.inject.service('library'),
  actions: {
    onlineClick(type) {
      this.get('library').loadLibrary(type);
    }
  }
});
