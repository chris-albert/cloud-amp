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
      d = pad(m.minutes())+ ':' + pad(m.seconds()),
      hours = m.hours();
    if(m.days() >= 1) {
      hours = m.days() * 24;
    }
    if(hours >= 1) {
      d = hours + ':' + d;
    }

    return d;
  }
};
