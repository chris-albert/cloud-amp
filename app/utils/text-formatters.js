import Ember from 'ember';

export default {
  duration: function (d) {
    function pad(num) {
      if(num < 10) {
        return '0' + num;
      }
      return num;
    }
    var m = moment.duration(d),
      d = pad(m.minutes())+ ':' + pad(m.seconds());
    if(m.hours() >= 1) {
      d = m.hours() + ':' + d;
    }
    return d;
  }
};