import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['browser-table'],
  actions: {
    itemClicked(id) {
      this.sendAction('action',id);
    },
    doubleClicked(id) {
      this.sendAction('doubleClick',id);
    }
  }
});
