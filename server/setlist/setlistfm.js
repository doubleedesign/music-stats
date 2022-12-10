import axios from 'axios';
import * as fs from 'fs';
import { CosmosClient } from '@azure/cosmos';
const api = 'https://api.setlist.fm/rest/1.0';
import savedArtists from '../data/setlist_artists.json' assert { type: 'json' }; // TODO: Get this from the database and use the JSON for local dev and testing only
import * as dotenv from 'dotenv';
import express from 'express';
dotenv.config();

const app = express();
const environment = app.get('env').trim();

const setlistfm = {
	/**
	 * Get Setlist.fm artist object (mainly for the mbid value, to be used for further Setlist queries)
	 * If the artist is already in locally saved file, return that // TODO: Or the database
	 * If they aren't, query the Setlist API and save + return the result
	 * @param name
	 * @return {Promise<{data: (*|string), status: (*|number)}|{data: *, status: number}>}
	 */
	getArtist: async function (name) {
		const url = `${api}/search/artists?artistName=${encodeURIComponent(name)}&p=1&sort=sortName`;
		const saved = savedArtists.find(item => item.name === name);
		let result;

		if(environment === 'LOCAL' && saved) {
			return {
				response: 200,
				data: saved
			};
		}

		// TODO: Update this to get saved value from the database in prod or if there isn't one locally
		
		try {
			const response = await axios.get(url, {
				headers: {
					'Accept': 'application/json',
					'Accept-Encoding': 'gzip, deflate, br',
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

			await this.saveArtist(result.data);

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

	},

	/**
	 * Once retrieved from the Setlist.fm API, save artist data to a file
	 * This means we can get artist IDs for further Setlist searches without querying their API every time we need an ID
	 * @param data
	 */
	saveArtist: async function (data) {
		// Save to CosmosDB
		// Note: When doing this before the local file save,
		// somehow the Cosmos ID is magically added to the data object (presumably by the Cosmos client)
		const key = process.env.COSMOS_KEY;
		const endpoint = process.env.COSMOS_ENDPOINT;
		const cosmosClient = new CosmosClient({ endpoint, key });

		const database = await cosmosClient.database('musicData');
		const container = await database.container('lineup');
		await container.items.create(data);

		// Save to file for local use
		if(environment === 'LOCAL') {
			const jsonString = fs.readFileSync('./data/setlist_artists.json');
			const jsonObject = JSON.parse(jsonString);
			jsonObject.push(data);
			fs.writeFileSync('./data/setlist_artists.json', JSON.stringify(jsonObject, null, 4));
		}
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