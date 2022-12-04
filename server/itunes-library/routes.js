import express from 'express';
import artists from './artists.js';
import _ from 'lodash';
import tracks from '../../data/tracks.json' assert { type: 'json' };

const router = express.Router();

router.get('/all', (req, res, next) => {
	const grouped = _.groupBy(tracks, 'album_artist');
	const result = [];
	Object.keys(grouped).map(artist => {
		result.push(artists.getSummary(artist));
	});

	res.json(_.sortBy(result, ['total_plays']).reverse());
});

router.get('/:name', (req, res, next) => {
	const result = artists.getSummary(req.params.name);
	res.json(result);
});

router.get('/:name/albums', (req, res, next) => {
	const result = artists.getAlbums(req.params.name);
	res.json(result);
});

router.get('/:name/tracks', (req, res, next) => {
	const result = artists.getTracks(req.params.name);
	res.json(result);
});

export default router;