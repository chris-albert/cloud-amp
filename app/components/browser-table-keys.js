import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['browser-table'],
  //The row objects for our table
  items: null,
  //The headers object for our table
  headers: null,
  actions: {
    itemClicked(item) {
      console.log(item);
      //this.sendAction('action',id);
    },
    doubleClicked(item) {
      console.log(item);
      //this.sendAction('doubleClick',id);
    }
  }
});
