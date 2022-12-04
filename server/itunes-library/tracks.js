import data from '../../data/tracks.json' assert { type: 'json' };
import _ from 'lodash';

const tracks = {
	/**
	 * Get all tracks, sorted by play count
	 * @return {*}
	 */
	getAll: function() {
		return _.sortBy(data, ['play_count']).reverse();
	},

	/**
	 * Get the top X most played tracks
	 * @param number
	 * @return {*}
	 */
	getTop: function(number) {
		return this.getAll().slice(0, number);
	}
};

export default tracks;