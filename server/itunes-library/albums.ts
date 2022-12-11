import { cosmosQueries } from '../cosmos/cosmos-utils.js';
import { Album, AlbumResponse, Track } from '../types';
import _ from 'lodash';

const albums = {
	/**
	 * Get all albums, sorted by total track play count
	 * @return {*}
	 */
	getAll: async function (): Promise<Album[]> {
		const { tracks } = await cosmosQueries.getAllTracks();
		const grouped: {string: Track[]} = _.groupBy(tracks, 'album');

		// Don't group tracks without an album into an album with an empty title
		const filtered: [string, Track[]][] = Object.entries(grouped).filter(([title, tracks]) => {
			if (title !== '') {
				return [title, tracks];
			}
		});

		const data: Album[] = filtered.map(([title, tracks]) => {
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
	getTop: function(number, withTracks = false): Album[] {
		let data: Album[] = this.getAll().slice(0, number);
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
	 * @returns Promise<AlbumResponse>
	 */
	getSingle: async function (title): Promise<AlbumResponse> {
		const albums: Album[] = await this.getAll();
		const result: Album = albums.find(item => item.title === decodeURIComponent(title));

		if (result) {
			return {
				status: 200,
				data: result
			};
		}
        else {
			return {
				status: 404,
				message: `Album "${title}" not found`,
				data: null
			};
		}
	}
};

export default albums;