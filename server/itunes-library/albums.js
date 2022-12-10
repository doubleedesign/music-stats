import tracks from '../data/tracks_test.json' assert { type: 'json' };
import _ from 'lodash';

const albums = {
	/**
	 * Get all albums, sorted by total track play count
	 * @return {*}
	 */
	getAll: function() {
		const grouped = _.groupBy(tracks, 'album');

		// Don't group tracks without an album into an album with an empty title
		const filtered = Object.entries(grouped).filter(([title, data]) => {
			if (title !== '') {
				return [title, tracks];
			}
		});

		const data = filtered.map(([title, tracks]) => {
			return {
				title: title,
				artist: tracks[0].album_artist,
				year: tracks[0].year,
				total_track_plays: tracks.reduce((accumulator, currentItem) => accumulator + currentItem.play_count, 0),
				tracks: _.sortBy(tracks, ['track_number'])
			};
		});

		return _.sortBy(data, ['total_track_plays']).reverse();
	},

	/**
	 * Get the top X most played albums
	 * @param number
	 * @param withTracks
	 * @return {*}
	 */
	getTop: function(number, withTracks = false) {
		let data = this.getAll().slice(0, number);
		if(!withTracks) {
			data = _.map(data, item => _.omit(item, 'tracks'));
		}

		return data;
	},

	/**
	 * Search for albums by name
	 * @param title
	 */
	searchFor: function(title) {
		// TODO. Return all albums containing the search query in the title
	},

	/**
	 * Get a single album by its name (because albums don't have IDs)
	 * @param title
	 * @returns {{data: string, status: number}|{data: *, status: number}}
	 */
	getSingle: function(title) {
		const result = this.getAll().find(item => item.title === decodeURIComponent(title));

		if(result) {
			return {
				status: 200,
				data: result
			};
		}
		else {
			return {
				status: 404,
				data: `Album "${title}" not found`
			};
		}
	}
};

export default albums;