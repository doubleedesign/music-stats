import express from 'express';
import artists from './artists.js';
import albums from './albums.js';
import tracks from './tracks.js';
import _ from 'lodash';

const router = express.Router();

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

router.get('/artists', (req, res, next) => {
	const result = artists.getAll();
	res.json(_.sortBy(result, ['total_plays']).reverse());
});

router.get('/artist/:name', (req, res, next) => {
	const result = artists.getSummary(req.params.name);
	res.json(result);
});

router.get('/artist/:name/albums', (req, res, next) => {
	const result = artists.getAlbums(req.params.name);
	res.json(result);
});

router.get('/artist/:name/tracks', (req, res, next) => {
	const result = artists.getTracks(req.params.name);
	res.json(result);
});

router.get('/albums', (req, res, next) => {
	const result = albums.getAll();
	res.json(result);
});

router.get('/album/:title', (req, res, next) => {
	const result = albums.getSingle(encodeURIComponent(req.params.title));
	res.status(result.status).json(result.data);
});

export default router;