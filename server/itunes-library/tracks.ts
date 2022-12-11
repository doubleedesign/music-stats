import { cosmosQueries } from '../cosmos/cosmos-utils.js';
import { TrackResponse, Track } from '../types';
import _ from 'lodash';

const tracks = {
	/**
	 * Get all tracks, sorted by play count
	 * @return Promise<Track[]>
	 */
	getAll: async function (): Promise<Track[]> {
		const { tracks } = await cosmosQueries.getAllTracks();

		return _.sortBy(tracks, ['play_count']).reverse();
	},

	/**
	 * Get the top X most played tracks
	 * @param number
	 * @return Promise<Track[]>
	 */
	getTop: function(number): Promise<Track[]> {
		const data: Track[] = this.getAll().slice(0, number);

		return _.map(data, item => _.pick(item, ['name', 'artist', 'play_count', 'album', 'year', 'persistent_id']));
	},

	/**
	 * Get a single track by its persistent ID
	 * @param id
	 * @returns Promise<TrackResponse>
	 */
	getSingle: async function (id): Promise<TrackResponse> {
		const { tracks } = await cosmosQueries.getAllTracks();
		const result: Track = tracks.find(item => item.persistent_id === id);

		if (result) {
			return {
				status: 200,
				data: result
			};
		}
        else {
			return {
				status: 404,
				message: `Track ${id} not found`,
				data: undefined
			};
		}
	}
};

export default tracks;