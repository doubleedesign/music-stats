import { CosmosClient } from '@azure/cosmos';
import * as dotenv from 'dotenv';
import { TracksResponse } from '../types';
dotenv.config();

const key = process.env.COSMOS_KEY;
const endpoint = process.env.COSMOS_ENDPOINT;
const cosmosClient = new CosmosClient({ endpoint, key });
const database = await cosmosClient.database('musicData');
const container = await database.container('catalogue_2022-12-06'); // TODO: Work out how to get the most recent

export const cosmosQueries = {
	/**
	 * Query the container of tracks and return everything
	 * Note: This returns thousands of results so should be used sparingly.
	 * // TODO: Investigate possible refactors to ensure this actually used sparingly
	 * @returns Promise<TracksResponse>
	 */
	getAllTracks: async function (): Promise<TracksResponse> {
		// Note: 'tracks' here can be anything, it's a NoSQL container thingy
		// (and we've already defined which container above) not a relational db table
		const querySpec = {
			query: 'select * from tracks'
		};

		try {
			const { resources } = await container.items.query(querySpec).fetchAll();
			if (resources.length > 0) {
				return {
					status: 200,
					tracks: resources
				};
			}
            else {
				return {
					status: 404,
					tracks: []
				};
			}
		}
        catch (error) {
			return {
				status: error.code,
				message: error.body,
				tracks: []
			};
		}
	},

	/**
	 * Query the container of tracks for results by a field e.g., artist, genre
	 * @param field
	 * @param value
	 * @returns Promise<TracksResponse>
	 */
	getTracks: async function (field, value): Promise<TracksResponse> {
		// Note: 'tracks' is not required here and could be anything, I just have it there for clarity
		// t is a variable that represents each item and so can have any name also
		const querySpec = {
			query: `select * from tracks t where t.${field}="${decodeURIComponent(value)}"`
		};

		try {
			const { resources } = await container.items.query(querySpec).fetchAll();
			if(resources.length > 0) {
				return {
					status: 200,
					tracks: resources
				};
			}
			else {
				return {
					status: 404,
					tracks: []
				};
			}
		}
		catch(error) {
			return {
				status: error.code,
				message: error.body,
				tracks: []
			};
		}
	}
};