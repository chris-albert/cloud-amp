import Ember from 'ember';

export default Ember.Service.extend({

	addTrack(track) {
		console.log('Add track to playlist: ' + track)
	}
});