import axios from 'axios';
import * as fs from 'fs';
const api = 'https://api.setlist.fm/rest/1.0';
import savedArtists from '../../data/setlist_artists.json' assert { type: 'json' };

const setlistfm = {
	/**
	 * Get Setlist.fm artist object (mainly for the mbid value, to be used for further Setlist queries)
	 * If the artist is already in locally saved file, return that
	 * If they aren't, query the Setlist API and save + return the result
	 * @param name
	 * @return {Promise<{data: (*|string), status: (*|number)}|{data: *, status: number}>}
	 */
	getArtist: async function (name) {
		const url = `${api}/search/artists?artistName=${encodeURIComponent(name)}&p=1&sort=sortName`;
		let result;

		const saved = savedArtists.find(item => item.name === name);
		if (saved) {
			result = {
				response: 200,
				data: saved
			};
			return result;
		}
		else {
			try {
				const response = await axios.get(url, {
					headers: {
						'Accept': 'application/json',
						'Accept-Encoding': 'gzip, deflate, br',
						// eslint-disable-next-line no-undef
						'x-api-key': process.env.SETLIST_API_KEY
					}
				});
				const searchResults = response.data.artist;
				result = {
					status: 200,
					data: searchResults.find(item => {
						return item.name === name; // return the likely correct result if there's multiple
					})
				};

				this.saveArtist(result.data);
				return result;
			}
			catch (error) {
				console.log(error);
				result = {
					status: error?.response?.status || 500,
					data: error?.response?.data || 'Error in setlistfm.js'
				};
				return result;
			}
		}
	},

	/**
	 * Once retrieved from the Setlist.fm API, save artist data to a file
	 * This means we can get artist IDs for further Setlist searches without querying their API every time we need an ID
	 * @param data
	 */
	saveArtist: function(data) {
		const jsonString = fs.readFileSync('../data/setlist_artists.json');
		const jsonObject = JSON.parse(jsonString);
		jsonObject.push(data);
		fs.writeFileSync('../data/setlist_artists.json', JSON.stringify(jsonObject, null, 4));
	},

	/**
	 * Get an artist's MBID for use in Setlist.fm queries
	 * @param name
	 * @return {*|undefined}
	 */
	getArtistId: async function (name) {
		const artist = await this.getArtist(name);
		return artist?.data?.mbid || undefined;
	}
};

export default setlistfm;