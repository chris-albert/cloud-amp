import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['browser-table'],
  //The row objects for our table
  items: null,
  //The headers object for our table
  headers: null,
  //What key you would like to sort the rows by
  //If no sort by set, then no sort will happen
  sortBy: null,
  actions: {
    itemClicked(item) {
      this.sendAction('click',item);
    },
    doubleClicked(item) {
      this.sendAction('doubleClick',item);
    }
  },
  sorted(data, key) {
    if (data) {
      return data.sort((a, b) => {
        if (a[key] < b[key]) {
          return -1;
        }
        if (a[key] > b[key]) {
          return 1;
        }
        return 0;
      });
    }
  },
  sortedItems: Ember.computed('items.@each.playing','items.@each.played',function() {
    var sortBy = this.get('sortBy'),
      items = this.get('items');
    if(sortBy) {
      //Here we reset the items so the sort is preserved
      this.set('items',this.sorted(items,this.get('sortBy')));
    }
    return items;
  })
});
