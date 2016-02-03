import Ember from 'ember';
import _ from 'lodash';

export default Ember.Component.extend({
  classNames: ['player-container'],
  actions: {
  	play() {
  		console.log('playing');
  		Ember.$.getJSON('http://localhost:3000/streamUrl/T7pjmwdxaegr3aqcumgta64tkzy')
  		  .then(r => {
  		  	console.log(r);
  		  	var audio = new Audio();
  		  	audio.autoplay = true;
  		  	audio.src = r.url;
         });
  	}
  }
});