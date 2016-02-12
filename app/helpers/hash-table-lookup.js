import Ember from 'ember';
import _ from 'lodash';
import textFormatters from '../utils/text-formatters';

function hashTableLookup(params) {

  if(params.length >= 2) {
    var obj = params[0],
        column = params[1],
        value = null;
    if(column.name) {
      value = Ember.get(obj,column.name);
    } else if(column.names) {
      value = _.map(column.names,name => {
        return Ember.get(obj,name);
      }).join(column.join);
    }
    if(column.format && _.isFunction(textFormatters[column.format])) {
      return textFormatters[column.format](value);
    }
    return value;
  }
}

export default Ember.Helper.helper(hashTableLookup);
