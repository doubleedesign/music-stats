import _ from 'lodash';
import { cosmosQueries } from '../cosmos/cosmos-utils.js';

const artists = {
	/**
	 * Get all artists, sorted by total track play count
	 * @return {*}
	 */
	getAll: async function () {
		const { tracks } = await cosmosQueries.getAllTracks();
		const grouped = _.groupBy(tracks, 'album_artist');
		let result = [];
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
	getTop: async function(number) {
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
	 * @param withTracks
	 * @return {{year: *, title: *, total_track_plays: *, tracks: *|unknown[]}[]}
	 */
	getAlbums: async function(artist, withTracks = false) {
		const { tracks } = await cosmosQueries.getTracks('album_artist', artist);
		const albums = _.groupBy(tracks, 'album');

		// Don't group tracks without an album into an album with an empty title
		const filtered = Object.entries(albums).filter(([title, data]) => {
			if (title !== '') {
				return [title, tracks];
			}
		});

		let data = filtered.map(([title, tracks]) => {
			const sorted_tracks = _.sortBy(tracks, ['track_number']);
			return {
				title: title,
				year: tracks[0].year,
				total_track_plays: tracks.reduce((accumulator, currentItem) => accumulator + currentItem.play_count, 0),
				tracks: _.map(sorted_tracks, item => {
					return _.pick(item, ['name', 'album', 'year', 'play_count', 'persistent_id']);
				})
			};
		});

		if (!withTracks) {
			data = _.map(data, item => _.omit(item, 'tracks'));
		}

		return _.sortBy(data, ['year']);
	},

	/**
	 * Get all tracks by an artist, sorted by year then track number
	 * (theoretically the order you would get if you listened to their catalogue start to finish)
	 * @param artist
	 * @return {*}
	 */
	getTracks: async function(artist) {
		const { tracks } = await cosmosQueries.getTracks('album_artist', artist);
		const sorted = _.sortBy(tracks, ['year', 'track_number']);
		return _.map(sorted, item => {
			return _.omit(item, ['track_id', 'sort_album', 'album_artist']);
		});
	},

	/**
	 * Get a summary of artist data and library stats
	 * @param artist
	 * @return {{albums: *[], total_plays: {year: *, title: *, total_track_plays: *, tracks: (*|?[])}, most_played: {albums: T[], tracks: T[]}, name}}
	 */
	getSummary: async function(artist) {
		const albums = await this.getAlbums(artist); // TODO: Work out why this has a "Redundant 'await' for a non-promise type" given it does return a promise
		const tracks = _.map(await this.getTracks(artist), item => {
			return _.pick(item, ['name', 'album', 'year', 'play_count', 'persistent_id']);
		});

		return {
			name: artist,
			total_plays: albums.reduce((accumulator, currentItem) => accumulator + currentItem.total_track_plays, 0),
			albums: albums.map(album => album.title),
			most_played: {
				albums: _.sortBy(albums, ['total_track_plays']).reverse().slice(0,3),
				tracks: _.sortBy(tracks, ['play_count']).reverse().slice(0,10),
			}
		};
	}
};

export default artists;