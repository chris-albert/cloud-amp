import Ember from 'ember';
import _ from 'lodash';
import textFormatters from '../utils/text-formatters';

function hashLookup(params) {

  if(params.length >= 2) {
    var obj = params[0],
        column = params[1],
        value = obj[column.name];
    if(column.format && _.isFunction(textFormatters[column.format])) {
      return textFormatters[column.format](value);
    }
    return value;
  }
}

export default Ember.Helper.helper(hashLookup);
