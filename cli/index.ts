import { XMLParser } from 'fast-xml-parser';
import { readFileSync, writeFile } from 'fs';
import { Track } from './types';
import * as dotenv from 'dotenv';
dotenv.config();
import { CosmosClient } from '@azure/cosmos';


// Expecting iTunes library XML export for the file. Notes:
// Remove playlists, so it's just the track data
// This expects structure of <plist><dict containing a bunch of keys we don't need><dict of the actual tracks>
const parseXML = () => {
	const file = readFileSync('./xml/Library.xml', 'utf8');

	// Parse XML to JSON using fast-xml-parser library
	// NOTE: preserveOrder is important! Without it, we get a tricky and unreliable structure of
	// {key: all the keys, string: all the values that are strings, ...etc for all the data types present}
	// with it, they stay in order e.g. key: {data about the key}, string:{the value and data about it}
	const parser = new XMLParser({
		ignoreDeclaration: true, // ignore <?xml> declaration tag
		preserveOrder: true,
		textNodeName: 'value'
	});
	const json = parser.parse(file);

	// Get the date of the export
	const date = Date.parse(json[0].plist[0].dict[7].date[0].value);
	if(isNaN(date)) {
		throw new TypeError('Valid export date not found. XML data structure may have changed, ' +
			'in which case you need to update the source of "date" on line 31.');
	}
	const modified = new Date(date).toISOString().split('T')[0];
	console.log(modified);

	// Get track data
	const data = json[0].plist[0].dict;
	const raw = data[data.length - 1].dict; // assuming the <dict> containing the tracks is the last element

	// Using preserveOrder: true, we get key objects followed by the corresponding value <dict> objects
	// We don't actually need the <key>s, so we can filter to get just the <dict>s first
	const filtered = Object.values(raw).filter(({ dict }: any) => dict);

	// Then, reduce that down so we don't have the "dict" property key anymore - just the data objects
	// @ts-ignore
	const rawTracks = filtered.map(item => item.dict);

	// Then, each raw track object is a series of keys and values in objects
	// So we have to loop through them all to transform them (adding the transformed values to a new array)
	const tracks: Track[] = [];
	Object.entries(rawTracks).map(([k, data]) => {
		// Initialise object that will store the data for this individual track
		const formatted: Track = {
			track_id: 0,
			persistent_id: '',
			name: '',
			play_count: 0,
			total_time: '',
			artist: '',
			album_artist: '',
			composer: '',
			album: '',
			sort_album: '',
			track_number: 0,
			year: '',
			genre: ''
		};

		// Each value is also an array of key objects followed by value objects labelled by data type
		// This time, we do want the keys
		// This implementation assumes a consistent key, value, key, value pattern with expected structures in the data
		for (let i = 0; i < data.length; i += 2) {

			// data[i] is the key, in a format like { key: [ { value: 'Artist' } ] } (where "Artist" is the bit we want)
			// Object.entries converts that to an array, but it's nested, so .flat() simplifies it to something like
			// [ 'key', [ { value: 'Artist' } ] ]
			const thisKeyData = Object.entries(data[i]).flat();

			// data[i + 1] is expected to be the track data that matches this key
			// Using Object.values() here because we don't need the key (it's the data type of the value)
			// This also results in a weirdly nested array that needs to be flattened to get to the data more easily
			// Final result is an array with one value, which is an object: [ { value: 'The Corrs' } ]
			const thisValueData = Object.values(data[i + 1]).flat();

			// Check that we are definitely looking at a key, and that the value exists
			if (thisKeyData[0] === 'key' && thisValueData[0]) {
				// Dig into the key and value objects to get what we want
				// @ts-ignore
				let key: string = thisKeyData[1][0]['value'];
				// @ts-ignore
				const value: string = thisValueData[0]['value'];

				// There's some "tracks" I don't actually want - TV show episodes and sound clips
				// At the time of writing, all TV shows are from the iTunes store,
				// so "Kind": "Purchased MPEG-4 video file" is a reasonable way to find and exclude them
				if (key === 'Kind' && value === 'Purchased MPEG-4 video file') {
					return;
				}
				if (key === 'Genre' && value === 'Sound Clip') {
					return;
				}

				// There's also more data than I actually want, so let's only include what's specified in the Track type
				key = key.toLowerCase().replaceAll(' ', '_');
				if (Object.keys(formatted).includes(key)) {
					formatted[key] = value;
				}

				// Handle known data inconsistencies
				if (!formatted['album_artist']) {
					formatted['album_artist'] = formatted['artist'];
				}
			}
		}

		tracks.push(formatted);
	});

	// Save to a JSON file
	saveJSONFile(tracks);

	// Save to Azure CosmosDB
	sendToCosmos(tracks, modified).then();
};

/**
 * Save processed data as a JSON file
 * @param tracks
 */
function saveJSONFile(tracks) {
	writeFile('../data/tracks.json', JSON.stringify(tracks, null, 4), 'utf8', function (err) {
		if (err) {
			console.log('An error occurred while writing to file.');
			return console.log(err);
		}

		console.log('JSON file has been saved.');
	});
}

/**
 * Save processed data in CosmosDB NoSQL database
 * @param tracks
 * @param export_date
 */
async function sendToCosmos(tracks, export_date) {
	const key = process.env.COSMOS_KEY;
	const endpoint = process.env.COSMOS_ENDPOINT;
	const cosmosClient = new CosmosClient({ endpoint, key });

	const database  = await cosmosClient.database('musicData');
	console.log(`Connected to ${database.id} database successfully`);

	// Create container with the date of the iTunes export so data over time can be compared
	const { container } = await database.containers.createIfNotExists({ id: `catalogue_${export_date}` });
	console.log(`${container.id} container ready`);

	let count = 1;
	for (const item of tracks) {
		const { resource } = await container.items.create(item);
		count++;
		console.log(`${count}.\t '${resource.name}' inserted`);
	}

	console.log(`${count} tracks successfully added to database container catalogue_${export_date}`);
}

parseXML();