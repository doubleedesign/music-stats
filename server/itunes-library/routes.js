import express from 'express';
import artists from './artists.js';
import albums from './albums.js';
import tracks from './tracks.js';
import _ from 'lodash';

const router = express.Router();

/**
 * Cosmos queries return promises, so any function querying the database is async
 * which also means it returns a promise itself. MDN:
 * "If the return value of an async function is not explicitly a promise, it will be implicitly wrapped in a promise."
 * That's why so many functions in this app are async and have to be awaited (or followed by .then()).
 */

router.get('/', (req, res, next) => {
	const top_artists = artists.getTop(10);
	const top_albums = albums.getTop(10);
	const top_tracks = tracks.getTop(25);

	const result = {
		top_artists: {
			count: top_artists.length,
			data: top_artists
		},
		top_albums: {
			count: top_albums.length,
			data: top_albums
		},
		top_tracks: {
			count: top_tracks.length,
			data: top_tracks
		}
	};

	res.json(result);
});

router.get('/artists', (req, res, next) => {
	const result = artists.getAll();
	res.json(_.sortBy(result, ['total_plays']).reverse());
});

router.get('/artist/:name', async (req, res, next) => {
	const result = await artists.getSummary(req.params.name);
	res.json(result); // TODO: Error handling
});

router.get('/artist/:name/albums', async (req, res, next) => {
	const result = await artists.getAlbums(req.params.name, true);
	res.json(result); // TODO: Error handling
});

router.get('/artist/:name/tracks', async (req, res, next) => {
	const result = await artists.getTracks(req.params.name);
	res.json(result);
});

router.get('/albums', async (req, res, next) => {
	const result = await albums.getAll();
	res.json(result);
});

router.get('/album/:title', async (req, res, next) => {
	const result = await albums.getSingle(encodeURIComponent(req.params.title));
	res.status(result.status).json(result.data);
});

router.get('/track/:id', async (req, res, next) => {
	const result = await tracks.getSingle(req.params.id);
	res.status(result.status).json(result.data);
});

export default router;