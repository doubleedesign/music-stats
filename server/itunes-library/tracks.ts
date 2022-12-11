import { cosmosQueries } from '../cosmos/cosmos-utils.js';
import _ from 'lodash';

const tracks = {
	/**
	 * Get all tracks, sorted by play count
	 * @return {*}
	 */
	getAll: async function () {
		const { tracks } = await cosmosQueries.getAllTracks();
		return _.sortBy(tracks, ['play_count']).reverse();
	},

	/**
	 * Get the top X most played tracks
	 * @param number
	 * @return {*}
	 */
	getTop: function(number) {
		const data = this.getAll().slice(0, number);

		return _.map(data, item => _.pick(item, ['name', 'artist', 'play_count', 'album', 'year', 'persistent_id']));
	},

	/**
	 * Get a single track by its persistent ID
	 * @param id
	 * @returns {*}
	 */
	getSingle: async function (id) {
		const { tracks } = await cosmosQueries.getAllTracks();
		const result = tracks.find(item => item.persistent_id === id);

		if (result) {
			return {
				status: 200,
				data: result
			};
		}
        else {
			return {
				status: 404,
				data: `Track ${id} not found`
			};
		}
	}
};

export default tracks;