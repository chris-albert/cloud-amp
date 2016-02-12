import Ember from 'ember';
import Resolver from 'ember/resolver';
import _ from 'lodash';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

Ember.computed.if = function(key,t,f) {
  return Ember.computed(key,function() {
    if(this.get(key)) {
      return t;
    } else {
      return f;
    }
  });
};

Ember.computed.switch = function(key,obj) {
  return Ember.computed(key,function() {
    return obj[this.get(key)];
  });
};

Ember.computed.func = function() {
  var keys = _.initial(arguments),
      func = _.last(arguments),
      f = function() {
        var args = _.map(keys,key => {
          return this.get(key);
        });
        return func.apply(this,args);
      };
  return Ember.computed.apply(this,keys.concat([f]));
};

loadInitializers(App, config.modulePrefix);

export default App;
