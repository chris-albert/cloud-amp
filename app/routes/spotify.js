import Ember from 'ember';
import _ from 'lodash';

export default Ember.Route.extend({
  spotify: Ember.inject.service('spotify-resource'),
  beforeModel(p)  {
    return this.get('spotify').exchangeCode(p.queryParams.code)
      .then(d => {
        this.transitionTo('index');
      });
  }
});
