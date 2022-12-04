import express from 'express';
import artists from './artists.js';
import _ from 'lodash';
import tracks from '../data/tracks.json' assert { type: 'json' };

const app = express();
app.listen(4000, () => {
	console.log('Server running on port 4000');
});

app.get('/artists', (req, res, next) => {
	const grouped = _.groupBy(tracks, 'album_artist');
	const result = [];
	Object.keys(grouped).map(artist => {
		result.push(artists.getSummary(artist));
	});

	res.json(_.sortBy(result, ['total_plays']).reverse());
});

app.get('/artist/:name', (req, res, next) => {
	const result = artists.getSummary(req.params.name);
	res.json(result);
});

app.get('/artist/:name/albums', (req, res, next) => {
	const result = artists.getAlbums(req.params.name);
	res.json(result);
});

app.get('/artist/:name/tracks', (req, res, next) => {
	const result = artists.getTracks(req.params.name);
	res.json(result);
});