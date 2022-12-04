import tracks from '../../data/tracks.json' assert { type: 'json' };
import _ from 'lodash';

const albums = {
	/**
	 * Get all albums, sorted by total track play count
	 * @return {*}
	 */
	getAll: function() {
		const grouped = _.groupBy(tracks, 'album');

		const data = Object.entries(grouped).map(([title, tracks]) => {
			return {
				title: title,
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
	 * @return {*}
	 */
	getTop: function(number) {
		return this.getAll().slice(0, number);
	}
};

export default albums;