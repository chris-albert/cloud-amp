import Ember from 'ember';

export default Ember.Component.extend({
  fmtTime: Ember.computed('time',function() {
    return moment(this.get('time')).format('mm:ss');
  })
});
