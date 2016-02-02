import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['browser-table'],
  sortedArtists: Ember.computed('model.artists',function() {
    return this.get('model.artists').sort((a,b) => {
      if(a.name < b.name) return -1;
      if(a.name > b.name) return 1;
      return 0;
    });
  })
});