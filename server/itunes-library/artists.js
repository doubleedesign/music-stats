import tracks from '../../data/tracks.json' assert { type: 'json' };
import _ from 'lodash';

const artists = {
	/**
	 * Get all artists, sorted by total track play count
	 * @return {*}
	 */
	getAll: function() {
		const grouped = _.groupBy(tracks, 'album_artist');
		const result = [];
		Object.keys(grouped).map(artist => {
			result.push(artists.getSummary(artist));
		});

		return _.sortBy(result, ['total_plays']).reverse();
	},

	/**
	 * Get the top X most played artists
	 * @param number
	 * @return {*}
	 */
	getTop: function(number) {
		const filtered = this.getAll().filter((item) => {
			if(item.name !== 'Various Artists') {
				return item;
			}
		});

		return filtered.slice(0, number);
	},

	/**
	 * Get all albums by an artist, sorted by year
	 * @param artist
	 * @return {{year: *, title: *, total_track_plays: *, tracks: *|unknown[]}[]}
	 */
	getAlbums: function(artist) {
		const grouped = _.groupBy(tracks, 'album_artist');
		const this_artist = grouped[artist];
		const albums = _.groupBy(this_artist, 'album');

		const data = Object.entries(albums).map(([title, tracks]) => {
			return {
				title: title,
				year: tracks[0].year,
				total_track_plays: tracks.reduce((accumulator, currentItem) => accumulator + currentItem.play_count, 0),
				tracks: _.sortBy(tracks, ['track_number'])
			};
		});

		return _.sortBy(data, ['year']);
	},

	/**
	 * Get all tracks by an artist, sorted by year then track number
	 * (theoretically the order you would get if you listened to their catalogue start to finish)
	 * @param artist
	 * @return {*}
	 */
	getTracks: function(artist) {
		const grouped = _.groupBy(tracks, 'album_artist');
		return _.sortBy(grouped[artist], ['year', 'track_number']);
	},

	/**
	 * Get a summary of artist data and library stats
	 * @param artist
	 * @return {{albums: *[], total_plays: {year: *, title: *, total_track_plays: *, tracks: (*|*[])}, most_played: {albums: T[], tracks: T[]}, name}}
	 */
	getSummary: function(artist) {
		const albums = this.getAlbums(artist);
		const tracks = this.getTracks(artist);

		return {
			name: artist,
			total_plays: albums.reduce((accumulator, currentItem) => accumulator + currentItem.total_track_plays, 0),
			albums: albums.map(album => album.title),
			most_played: {
				albums: _.sortBy(albums, ['total_track_plays']).reverse().slice(0,3),
				tracks: _.sortBy(tracks, ['play_count']).reverse().slice(0,5),
			}
		};
	}
};

export default artists;